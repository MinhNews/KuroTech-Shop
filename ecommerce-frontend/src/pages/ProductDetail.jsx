// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import UserAvatar from '../components/UserAvatar';

const ProductDetail = () => {
  const { id } = useParams();
  const { currentProduct, isLoading, fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  // Review States
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductById(id);
    // Lấy danh sách review
    axiosClient.get(`/reviews/product/${id}`).then(res => {
      setReviews(res.data);
    }).catch(err => console.error("Lỗi lấy review:", err));
  }, [id, fetchProductById]);

  useEffect(() => {
    if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
      setMainImage(currentProduct.images[0]);
    }
  }, [currentProduct]);

  const handleAddToCart = () => {
    if (!currentProduct) return;
    addToCart(currentProduct._id, quantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (currentProduct && quantity < currentProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm!");
      return;
    }
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await axiosClient.post('/reviews', {
        productId: id,
        rating: reviewRating,
        comment: reviewComment
      });
      // Thêm review mới vào đầu danh sách
      setReviews([res.data.data, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
      alert("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi gửi đánh giá!");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Tính trung bình sao
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  if (isLoading || !currentProduct) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 mt-4">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Images Gallery */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-8 border border-slate-100 overflow-hidden">
            <img 
              src={mainImage || 'https://via.placeholder.com/600'} 
              alt={currentProduct.name} 
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-105" 
            />
          </div>
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {currentProduct.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all p-2 bg-white ${mainImage === img ? 'border-slate-800 p-1' : 'border-transparent hover:border-slate-200'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-slate-400 block">
                {currentProduct.category?.name || "Chưa phân loại"}
              </span>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" size={16} />
                  <span className="font-bold text-slate-700">{avgRating}</span>
                  <span className="text-slate-400 text-sm">({reviews.length} đánh giá)</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              {currentProduct.name}
            </h1>
            <div className="text-3xl font-light text-slate-900 mb-6">
              {currentProduct.price.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-slate-600 leading-relaxed font-light">
              {currentProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          <hr className="border-slate-100 my-8" />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Tình trạng:</span>
              <span className={currentProduct.stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {currentProduct.stock > 0 ? `Còn hàng (${currentProduct.stock})` : "Hết hàng"}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden w-32">
                <button onClick={handleDecrease} className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition"><Minus size={16} /></button>
                <input type="text" value={quantity} readOnly className="w-full text-center font-medium focus:outline-none bg-transparent py-1" />
                <button onClick={handleIncrease} className="px-4 py-3 text-slate-600 hover:bg-slate-200 transition"><Plus size={16} /></button>
              </div>
              
              <button 
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white font-medium py-4 px-8 rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-16 bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          Đánh giá sản phẩm ({reviews.length})
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cột Viết Đánh giá */}
          <div className="lg:w-1/3">
            {!user ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-600 mb-4">Vui lòng đăng nhập để viết đánh giá</p>
                <Link to="/login" className="inline-block bg-primary text-white font-medium px-6 py-2 rounded-lg hover:bg-primaryHover transition">Đăng nhập</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Viết đánh giá của bạn</h3>
                
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-slate-600">Đánh giá:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setReviewRating(star)}
                        className={`transition ${reviewRating >= star ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-200'}`}
                      >
                        <Star fill="currentColor" size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <textarea 
                    required
                    rows="4" 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Sản phẩm này thế nào? (Chất lượng, màu sắc...)" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary text-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </form>
            )}
          </div>

          {/* Cột Danh sách Đánh giá */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét sản phẩm này!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={rev.user} size="md" />
                      <div>
                        <div className="font-bold text-slate-800">{rev.user?.username || "Khách hàng ẩn danh"}</div>
                        <div className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-yellow-400" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm pl-13 mt-2">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
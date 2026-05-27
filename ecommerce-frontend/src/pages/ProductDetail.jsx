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
    <div className="max-w-7xl mx-auto pb-24 mt-8 px-4">
      <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-10 text-sm font-semibold tracking-wide">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.05)] border border-slate-100 flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
        
        {/* Images Gallery (Sticky) */}
        <div className="lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-32">
          <div className="w-full aspect-[4/3] md:aspect-square bg-[#f8fafc] rounded-3xl flex items-center justify-center p-12 border border-slate-100 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src={mainImage || 'https://via.placeholder.com/600'} 
              alt={currentProduct.name} 
              className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110 drop-shadow-xl" 
            />
          </div>
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {currentProduct.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 p-2 bg-white ${mainImage === img ? 'border-slate-800 p-1 shadow-md scale-105' : 'border-slate-100 hover:border-slate-300 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {currentProduct.category?.name || "Khác"}
              </span>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star fill="currentColor" size={14} />
                  <span className="font-bold text-slate-800 text-sm">{avgRating}</span>
                  <span className="text-slate-500 text-xs">({reviews.length})</span>
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              {currentProduct.name}
            </h1>
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-8 inline-block">
              {currentProduct.price.toLocaleString('vi-VN')} ₫
            </div>
            <p className="text-slate-500 leading-relaxed font-light text-lg">
              {currentProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-slate-200 via-slate-200 to-transparent my-8"></div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-600 font-medium">Tình trạng kho:</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${currentProduct.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`}></span>
                <span className={currentProduct.stock > 0 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                  {currentProduct.stock > 0 ? `Sẵn sàng (${currentProduct.stock})` : "Hết hàng"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center justify-between border-2 border-slate-100 rounded-full bg-white overflow-hidden w-full sm:w-40 h-14 shadow-sm">
                <button onClick={handleDecrease} className="w-12 h-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition flex items-center justify-center"><Minus size={18} /></button>
                <input type="text" value={quantity} readOnly className="flex-1 text-center font-bold text-lg text-slate-900 focus:outline-none bg-transparent" />
                <button onClick={handleIncrease} className="w-12 h-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition flex items-center justify-center"><Plus size={18} /></button>
              </div>
              
              <button 
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-full hover:shadow-[0_10px_40px_rgb(15,23,42,0.3)] hover:-translate-y-1 transition-all duration-300 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
              >
                <ShoppingBag size={20} />
                Thêm Vào Giỏ
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
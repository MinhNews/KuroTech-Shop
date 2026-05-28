// src/pages/admin/AdminReviewManage.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';
import { Star, MessageSquare, Reply, Check, Trash2, X, AlertCircle, Edit } from 'lucide-react';
import UserAvatar from '../../components/UserAvatar';

const AdminReviewManage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/reviews/all');
      setReviews(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReplySubmit = async (reviewId) => {
    if (!replyContent.trim()) return;
    try {
      const res = await axiosClient.put(`/reviews/${reviewId}/reply`, { sellerReply: replyContent });
      setReviews(reviews.map(r => r._id === reviewId ? res.data.data : r));
      setReplyingId(null);
      setReplyContent('');
      toast.success('Đã gửi phản hồi!');
    } catch (error) {
      toast.error('Lỗi khi gửi phản hồi');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await axiosClient.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r._id !== reviewId));
      toast.success('Đã xóa đánh giá');
    } catch (error) {
      toast.error('Lỗi khi xóa đánh giá');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Đánh giá</h2>
          <p className="text-slate-500 text-sm mt-1">Phản hồi khách hàng và quản lý các bình luận</p>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
            Chưa có đánh giá nào trên hệ thống.
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                {/* User Info */}
                <div className="flex gap-4">
                  <UserAvatar user={review.user} size="lg" />
                  <div>
                    <h3 className="font-bold text-slate-800">{review.user?.username || 'Khách hàng'}</h3>
                    <p className="text-xs text-slate-500 mb-1">{new Date(review.createdAt).toLocaleString('vi-VN')}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {review.product && (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 min-w-[200px] h-fit">
                    <img src={review.product.images?.[0]} alt="" className="w-10 h-10 object-cover rounded-md" />
                    <div className="text-xs">
                      <p className="text-slate-500">Sản phẩm:</p>
                      <p className="font-semibold text-slate-800 truncate w-32" title={review.product.name}>{review.product.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <p className="text-slate-700 whitespace-pre-wrap pl-[4.5rem] mb-4">{review.comment}</p>

              {/* Media */}
              {(review.images?.length > 0 || review.videos?.length > 0) && (
                <div className="flex gap-2 pl-[4.5rem] mb-4 flex-wrap">
                  {review.videos?.map((vid, idx) => (
                    <video key={`vid-${idx}`} src={vid} controls className="h-20 w-20 object-cover rounded-lg border border-slate-200" />
                  ))}
                  {review.images?.map((img, idx) => (
                    <img key={`img-${idx}`} src={img} alt="review" className="h-20 w-20 object-cover rounded-lg border border-slate-200 cursor-pointer" onClick={() => window.open(img, '_blank')} />
                  ))}
                </div>
              )}

              {/* Reply Section */}
              <div className="pl-[4.5rem] border-t border-slate-200 pt-4 flex flex-col gap-4">
                {review.sellerReply ? (
                  <div className="bg-white border border-blue-100 rounded-xl p-4 relative">
                    <div className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-1">
                      Shop đã phản hồi <Check size={14} className="text-blue-500 bg-blue-100 rounded-full p-0.5" />
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap">{review.sellerReply}</p>
                    <button onClick={() => {setReplyingId(review._id); setReplyContent(review.sellerReply)}} className="text-xs text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"><Edit size={12}/> Sửa phản hồi</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span className="text-sm text-slate-500 italic">Chưa có phản hồi.</span>
                  </div>
                )}

                {replyingId === review._id && (
                  <div className="flex gap-2 mt-2">
                    <textarea 
                      value={replyContent} 
                      onChange={e => setReplyContent(e.target.value)} 
                      placeholder="Nhập phản hồi của bạn..." 
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary resize-none h-10"
                    ></textarea>
                    <button onClick={() => handleReplySubmit(review._id)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover h-10 whitespace-nowrap">Gửi</button>
                    <button onClick={() => {setReplyingId(null); setReplyContent('');}} className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-300 h-10"><X size={18}/></button>
                  </div>
                )}

                <div className="flex gap-4">
                   {!review.sellerReply && replyingId !== review._id && (
                     <button onClick={() => setReplyingId(review._id)} className="text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"><Reply size={16}/> Trả lời ngay</button>
                   )}
                   <button onClick={() => handleDelete(review._id)} className="text-sm text-red-500 hover:underline font-medium inline-flex items-center gap-1"><Trash2 size={16}/> Xóa review</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviewManage;

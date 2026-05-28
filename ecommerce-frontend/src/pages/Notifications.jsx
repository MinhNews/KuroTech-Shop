// src/pages/admin/Notifications.jsx
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { Bell, Check, Trash2 } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải thông báo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosClient.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải thông báo...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tất cả thông báo</h2>
            <p className="text-slate-500 text-sm mt-1">Xem tất cả thông báo của bạn</p>
          </div>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
            Không có thông báo nào.
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif._id} 
              className={`p-5 rounded-2xl border transition-all ${!notif.isRead ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                    <h3 className={`text-base ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {notif.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-2 pl-4">{notif.message}</p>
                  <p className="text-xs text-slate-400 pl-4">
                    {new Date(notif.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {!notif.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Đánh dấu đã đọc"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;

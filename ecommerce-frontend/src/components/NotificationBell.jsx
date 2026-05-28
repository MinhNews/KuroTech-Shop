import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import useAuthStore from '../store/useAuthStore';

const NotificationBell = ({ direction = 'down' }) => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await axiosClient.get('/notifications');
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axiosClient.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute w-80 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[80vh] ${
            direction === 'up' ? 'bottom-full mb-4 left-0 origin-bottom-left' : 'top-full mt-2 right-0 origin-top-right'
        }`}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Bạn không có thông báo nào.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.slice(0, 5).map(notif => (
                  <div 
                    key={notif._id} 
                    className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      if(!notif.isRead) handleMarkAsRead(notif._id);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
            <Link to={user?.role === 'admin' || user?.role === 'staff' ? '/admin/notifications' : '/notifications'} onClick={() => setIsOpen(false)} className="text-xs text-slate-500 hover:text-primary font-medium p-2 w-full inline-block">
              Xem tất cả
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

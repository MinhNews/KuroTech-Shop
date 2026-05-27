import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Key, ShoppingBag, LogOut, ArrowLeft, Camera } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import UserAvatar from '../components/UserAvatar';

const Profile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'password', 'orders'
  
  // States for Info Tab
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  
  // Verify Email states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // States for Password Tab
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // States for Orders Tab
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders' && user?.role === 'customer') {
      setIsLoadingOrders(true);
      axiosClient.get('/orders/my-orders')
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setIsLoadingOrders(false));
    }
  }, [activeTab, user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setIsUpdatingInfo(true);
    try {
      const res = await axiosClient.put('/auth/profile', { username, email });
      updateUser(res.data.user);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi cập nhật thông tin");
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const handleSendVerifyCode = async () => {
    try {
      await axiosClient.post('/auth/send-verification');
      alert("Mã xác thực đã được gửi đến email của bạn!");
      setShowVerifyModal(true);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi gửi mã xác thực");
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      const res = await axiosClient.post('/auth/verify-email', { token: verifyCode });
      updateUser(res.data.user);
      alert("Xác thực email thành công!");
      setShowVerifyModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Mã xác thực không hợp lệ");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh JPG, PNG hoặc WEBP!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh không được vượt quá 5MB!');
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await axiosClient.put('/auth/avatar', formData);

      updateUser(res.data.user);
      setAvatarPreview(null);
      alert('Cập nhật avatar thành công!');
    } catch (error) {
      setAvatarPreview(null);
      alert(error.response?.data?.message || 'Lỗi upload avatar!');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return alert("Mật khẩu mới không khớp!");
    }
    setIsUpdatingPass(true);
    try {
      await axiosClient.put('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      alert("Đổi mật khẩu thành công!");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      
      {/* Nút Quay Lại */}
      <div className="mb-6">
        {user.role === 'customer' ? (
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft size={18} /> Quay về Trang chủ
          </Link>
        ) : (
          <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
            <ArrowLeft size={18} /> Quay về Dashboard
          </Link>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Profile */}
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center mb-6">
            <div className="relative group mb-4">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
              ) : (
                <UserAvatar user={user} size="lg" />
              )}
              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${isUploadingAvatar ? 'opacity-100' : ''}`}
              >
                {isUploadingAvatar ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera size={22} />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
            </div>
            <p className="text-xs text-slate-400 mb-3">Nhấn vào ảnh để đổi avatar</p>
            <h2 className="text-xl font-bold text-slate-800">{user.username}</h2>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-slate-500 text-sm">{user.email || "Chưa có email"}</p>
              {user.email && (
                user.isEmailVerified 
                  ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Đã xác thực</span>
                  : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">Chưa xác thực</span>
              )}
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
              {user.role}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-3 w-full p-4 text-left font-medium transition-colors border-l-4 ${activeTab === 'info' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
            >
              <User size={20} /> Thông tin cá nhân
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-3 w-full p-4 text-left font-medium transition-colors border-l-4 ${activeTab === 'password' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
            >
              <Key size={20} /> Đổi mật khẩu
            </button>
            
            {/* Lịch sử mua hàng chỉ hiện nếu là Customer */}
            {user.role === 'customer' && (
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 w-full p-4 text-left font-medium transition-colors border-l-4 ${activeTab === 'orders' ? 'bg-primary/5 text-primary border-primary' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}
              >
                <ShoppingBag size={20} /> Lịch sử đơn hàng
              </button>
            )}

            <button 
              onClick={() => {
                if (window.confirm("Bạn muốn đăng xuất?")) logout();
              }}
              className="flex items-center gap-3 w-full p-4 text-left font-medium text-red-500 hover:bg-red-50 transition-colors border-l-4 border-transparent"
            >
              <LogOut size={20} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            
            {/* TAB: THÔNG TIN CÁ NHÂN */}
            {activeTab === 'info' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Thông Tin Cá Nhân</h2>
                <form onSubmit={handleUpdateInfo} className="max-w-md flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email (Dùng để khôi phục mật khẩu)</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                      />
                      {user.email && !user.isEmailVerified && (
                        <button 
                          type="button" 
                          onClick={handleSendVerifyCode}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap hover:bg-yellow-600 transition"
                        >
                          Xác minh ngay
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tên hiển thị</label>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdatingInfo || (username === user.username && email === (user.email || ''))}
                    className="mt-4 bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primaryHover transition disabled:opacity-50"
                  >
                    {isUpdatingInfo ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Đổi Mật Khẩu</h2>
                <form onSubmit={handleChangePassword} className="max-w-md flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      required
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdatingPass}
                    className="mt-4 bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    {isUpdatingPass ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: LỊCH SỬ ĐƠN HÀNG (Chỉ Khách hàng) */}
            {activeTab === 'orders' && user.role === 'customer' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Lịch Sử Đơn Hàng</h2>
                
                {isLoadingOrders ? (
                  <div className="text-center py-12 text-slate-500">Đang tải lịch sử...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Bạn chưa có đơn hàng nào.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map(order => (
                      <div key={order._id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">Mã đơn: #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                            <p className="text-sm font-medium text-slate-700">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-600' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {order.status === 'pending' ? 'Chờ xác nhận' :
                             order.status === 'processing' ? 'Đang chuẩn bị' :
                             order.status === 'shipped' ? 'Đang giao hàng' :
                             order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-medium">Thanh toán:</span> {order.paymentMethod}</p>
                            <p className="text-sm text-slate-600"><span className="font-medium">Địa chỉ:</span> {order.shippingAddress}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Tổng tiền</p>
                            <p className="text-xl font-bold text-red-500">{order.totalAmount.toLocaleString('vi-VN')} ₫</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL XÁC THỰC EMAIL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nhập mã xác thực</h3>
            <p className="text-sm text-slate-500 mb-4">
              Mã xác thực 6 số đã được gửi đến email <strong>{user.email}</strong>. Vui lòng kiểm tra hộp thư (và thư rác).
            </p>
            <input 
              type="text" 
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="Ví dụ: 123456"
              className="w-full text-center tracking-[0.5em] font-mono text-xl px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleVerifyEmail}
                disabled={isVerifying || verifyCode.length < 6}
                className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primaryHover transition disabled:opacity-50"
              >
                {isVerifying ? 'Đang kiểm tra...' : 'Xác thực'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

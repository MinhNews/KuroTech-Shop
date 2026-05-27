import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axiosClient.post('/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Đặt lại Mật khẩu</h1>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm text-center">{message}</div>}

        <form onSubmit={handleReset} className="flex flex-col gap-5">
          <input 
            type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mật khẩu mới" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <input 
            type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Xác nhận mật khẩu mới" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primaryHover disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Về trang Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

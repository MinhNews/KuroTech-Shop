import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axiosClient.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
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
          <h1 className="text-3xl font-bold text-primary mb-2">Quên Mật Khẩu</h1>
          <p className="text-gray-500">Nhập email đã xác thực của bạn để nhận link khôi phục</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-sm text-center">{message}</div>}

        <form onSubmit={handleForgot} className="flex flex-col gap-5">
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn" 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primaryHover disabled:opacity-50"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi link khôi phục'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogIn } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Dùng để chuyển trang
  
  // Lấy hàm login, trạng thái loading và error từ kho ra
  const { login, googleLogin, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Gọi hàm login từ Zustand
    const isSuccess = await login(username, password);
    
    // Nếu API trả về thành công -> Kiểm tra Role để chuyển trang
    if (isSuccess) {
      const user = useAuthStore.getState().user;
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else if (user && user.role === 'staff') {
        navigate('/admin/orders');
      } else {
        navigate('/');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const isSuccess = await googleLogin(credentialResponse.credential);
    if (isSuccess) {
      const user = useAuthStore.getState().user;
      if (user && user.role === 'admin') navigate('/admin');
      else if (user && user.role === 'staff') navigate('/admin/orders');
      else navigate('/');
    }
  };

  const handleGoogleError = () => {
    console.error('Đăng nhập Google thất bại');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Đăng Nhập</h1>
          <p className="text-gray-500">Chào mừng bạn quay lại với KuroTech</p>
        </div>

        {/* Hiển thị lỗi nếu sai tài khoản/mật khẩu */}
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Ô Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
          </div>

          {/* Nút Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-primary text-white font-bold py-3 rounded-lg hover:bg-primaryHover transition-colors shadow-md disabled:bg-blue-300"
          >
            {isLoading ? 'Đang xử lý...' : (
              <>
                <LogIn size={20} />
                Đăng Nhập
              </>
            )}
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Hoặc đăng nhập bằng</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              theme="outline"
              size="large"
              text="continue_with"
              width="100%"
            />
          </div>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
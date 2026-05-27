// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState(''); // Lỗi do Frontend tự check (VD: Pass ko khớp)
  
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore(); // Lấy hàm đăng ký từ kho

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError(''); // Xóa lỗi cũ
    
    // 1. Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // 2. Gọi API Đăng ký
    const isSuccess = await register(username, email, password);
    
    // 3. Nếu thành công -> Tự động đăng nhập và vào trang chủ
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Đăng Ký</h1>
          <p className="text-gray-500">Trở thành thành viên của KuroTech</p>
        </div>

        {/* Hiển thị lỗi từ Backend hoặc Frontend */}
        {(error || validationError) && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
            {validationError || error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          {/* Ô Tên người dùng */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên hiển thị (Username)" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Ô Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (Tùy chọn - Dùng để khôi phục MK)" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Ô Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Ô Xác nhận Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận lại mật khẩu" 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>

          {/* Nút Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-primary text-white font-bold py-3 mt-2 rounded-lg hover:bg-primaryHover transition-colors shadow-md disabled:bg-blue-300"
          >
            {isLoading ? 'Đang tạo tài khoản...' : (
              <>
                <UserPlus size={20} />
                Đăng Ký Ngay
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Register;
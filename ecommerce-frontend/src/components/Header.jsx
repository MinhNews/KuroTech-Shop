// src/components/Header.jsx
import { useEffect } from 'react';
import { Search, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import UserAvatar from './UserAvatar';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const cartItemCount = cart?.items?.length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 transition-all duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-1">
          <span>Kuro</span><span className="text-slate-500 font-light">Tech</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full bg-slate-100 border border-transparent rounded-full py-2.5 pl-5 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-colors">
            <Search size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-colors">
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-primary transition-colors cursor-pointer">
                  <UserAvatar user={user} size="sm" />
                  <span className="hidden sm:inline-block">{user.username}</span>
                </Link>
                <Link to="/my-orders" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Đơn hàng
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-full hover:bg-primaryHover transition-all shadow-sm hover:shadow-md">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
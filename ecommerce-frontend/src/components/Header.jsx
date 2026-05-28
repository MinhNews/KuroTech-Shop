// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import UserAvatar from './UserAvatar';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Xóa thanh search sau khi tìm
    }
  };

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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-1 group">
          <span className="text-gradient">Kuro</span>
          <span className="text-slate-500 font-light group-hover:text-primary transition-colors duration-500">Tech</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-slate-500/5 backdrop-blur-sm border border-slate-200/50 rounded-full py-2 pl-5 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-200/50 transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          />
          <button 
            onClick={() => handleSearch({ key: 'Enter' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-primary transition-transform duration-300 hover:scale-110"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <Link to="/cart" className="relative text-slate-600 hover:text-primary transition-transform duration-300 hover:scale-110">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-200/60">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-primary transition-transform duration-300 hover:scale-105 cursor-pointer">
                  <UserAvatar user={user} size="sm" />
                  <span className="hidden sm:inline-block">{user.username}</span>
                </Link>
                <Link to="/my-orders" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Đơn hàng
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-transform duration-300 hover:scale-110 p-1"
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
                <Link to="/register" className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-all duration-300 hover:shadow-[0_8px_20px_rgb(15,23,42,0.2)] hover:-translate-y-0.5">
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
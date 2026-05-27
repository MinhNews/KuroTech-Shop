// src/components/AdminLayout.jsx
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, LayoutList, ShoppingCart, Users, Ticket, Bookmark } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import UserAvatar from './UserAvatar';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    ...(user.role === 'admin' ? [{ name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> }] : []),
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Khuyến mãi', path: '/admin/coupons', icon: <Ticket size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    ...(user.role === 'admin' ? [{ name: 'Danh mục', path: '/admin/categories', icon: <LayoutList size={20} /> }] : []),
    ...(user.role === 'admin' ? [{ name: 'Thương hiệu', path: '/admin/brands', icon: <Bookmark size={20} /> }] : []),
    ...(user.role === 'admin' ? [{ name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> }] : []),
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-1">
            <span>Kuro</span><span className="text-slate-400 font-light">Tech</span>
            <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-primary text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link to="/profile" className="flex items-center gap-3 mb-4 p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-white">
            <UserAvatar user={user} size="sm" />
            <div className="flex-1 overflow-hidden text-sm">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-[10px] text-slate-400">Xem Profile</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Quản trị'}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

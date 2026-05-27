import useAuthStore from './store/useAuthStore';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyOrders from './pages/MyOrders';
import AIChatbot from './components/AIChatbot';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManage from './pages/admin/ProductManage';
import CategoryManage from './pages/admin/CategoryManage';
import OrderManage from './pages/admin/OrderManage';
import UserManage from './pages/admin/UserManage';
import CouponManage from './pages/admin/CouponManage';
import BrandManage from './pages/admin/BrandManage';

// Component để check xem có render Header hay không (ẩn ở trang admin)
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={!isAdminRoute ? "min-h-screen pb-12" : ""}>
        <div className={!isAdminRoute ? "container mx-auto px-4 pt-6" : ""}>
          {children}
        </div>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <AIChatbot />}
    </>
  );
};

// Component ngăn Admin/Staff truy cập trang của khách
const RedirectIfAdmin = ({ children }) => {
  const { user } = useAuthStore();
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (user && user.role === 'staff') {
    return <Navigate to="/admin/orders" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Client Routes - Bọc bởi RedirectIfAdmin để đá Admin ra */}
          <Route path="/" element={<RedirectIfAdmin><Home /></RedirectIfAdmin>} />
          <Route path="/products" element={<RedirectIfAdmin><ProductList /></RedirectIfAdmin>} />
          <Route path="/product/:id" element={<RedirectIfAdmin><ProductDetail /></RedirectIfAdmin>} />
          <Route path="/cart" element={<RedirectIfAdmin><Cart /></RedirectIfAdmin>} />
          <Route path="/checkout" element={<RedirectIfAdmin><Checkout /></RedirectIfAdmin>} />
          <Route path="/my-orders" element={<RedirectIfAdmin><MyOrders /></RedirectIfAdmin>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManage />} />
            <Route path="categories" element={<CategoryManage />} />
            <Route path="orders" element={<OrderManage />} />
            <Route path="users" element={<UserManage />} />
            <Route path="coupons" element={<CouponManage />} />
            <Route path="brands" element={<BrandManage />} />
          </Route>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
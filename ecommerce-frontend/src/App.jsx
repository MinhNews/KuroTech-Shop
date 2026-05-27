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
import { AnimatePresence, motion } from 'framer-motion';

// Component để check xem có render Header hay không (ẩn ở trang admin)
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={!isAdminRoute ? "min-h-screen pb-12 pt-[100px]" : ""}>
        <div className={!isAdminRoute ? "container mx-auto px-4" : ""}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
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

// Page Transition Wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// Component con để sử dụng useLocation cho Routes
const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Routes location={location} key={location.pathname}>
      {/* Client Routes - Bọc bởi RedirectIfAdmin để đá Admin ra */}
      <Route path="/" element={<RedirectIfAdmin><PageTransition><Home /></PageTransition></RedirectIfAdmin>} />
      <Route path="/products" element={<RedirectIfAdmin><PageTransition><ProductList /></PageTransition></RedirectIfAdmin>} />
      <Route path="/product/:id" element={<RedirectIfAdmin><PageTransition><ProductDetail /></PageTransition></RedirectIfAdmin>} />
      <Route path="/cart" element={<RedirectIfAdmin><PageTransition><Cart /></PageTransition></RedirectIfAdmin>} />
      <Route path="/checkout" element={<RedirectIfAdmin><PageTransition><Checkout /></PageTransition></RedirectIfAdmin>} />
      <Route path="/my-orders" element={<RedirectIfAdmin><PageTransition><MyOrders /></PageTransition></RedirectIfAdmin>} />
      
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
      <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
      <Route path="/reset-password/:token" element={<PageTransition><ResetPassword /></PageTransition>} />
      <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

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
  );
};

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
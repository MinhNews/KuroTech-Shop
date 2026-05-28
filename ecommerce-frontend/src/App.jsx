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
import AdminReviewManage from './pages/admin/AdminReviewManage';
import Notifications from './pages/Notifications';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Component để check xem có render Header hay không (ẩn ở trang admin)
const MainLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const hideClientLayout = location.pathname.startsWith('/admin') || (user && ['admin', 'staff'].includes(user.role));
  
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          },
          success: {
            style: {
              background: '#0f172a',
              border: '1px solid #1e293b'
            }
          },
          error: {
            style: {
              background: '#ef4444',
            }
          }
        }} 
      />
      {!hideClientLayout && <Header />}
      <main className={!hideClientLayout ? "min-h-screen pb-12 pt-[100px]" : "h-screen overflow-hidden"}>
        <div className={!hideClientLayout ? "container mx-auto px-4" : "h-full w-full"}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>
      </main>
      {!hideClientLayout && <Footer />}
      {!hideClientLayout && <AIChatbot />}
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
      <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManage />} />
        <Route path="categories" element={<CategoryManage />} />
        <Route path="orders" element={<OrderManage />} />
        <Route path="users" element={<UserManage />} />
        <Route path="coupons" element={<CouponManage />} />
        <Route path="brands" element={<BrandManage />} />
        <Route path="reviews" element={<AdminReviewManage />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
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
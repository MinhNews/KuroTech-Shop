// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';

const Motion = motion;

const Home = () => {
  const { products, isLoading: isProductLoading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    // Lấy danh mục thật từ Backend
    axiosClient.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, [fetchProducts]);

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white min-h-[600px] flex items-center mt-4 soft-shadow">
        <Motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        </Motion.div>
        
        <div className="relative z-10 px-10 md:px-24 max-w-4xl">
          <Motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6"
          >
            Kỷ Nguyên Mới <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Công Nghệ Đỉnh Cao
            </span>
          </Motion.h1>
          <Motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed"
          >
            Khám phá bộ sưu tập thiết bị cao cấp được tuyển chọn khắt khe, mang đến sự tinh tế và hiệu suất vượt trội cho cuộc sống của bạn.
          </Motion.p>
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link to="/products" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:-translate-y-1">
              Khám Phá Ngay <ArrowRight size={20} />
            </Link>
          </Motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Danh Mục Nổi Bật</h2>
            <p className="text-slate-500 mt-3 text-lg">Tìm kiếm theo nhu cầu của bạn</p>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat, idx) => (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={cat._id}
              >
                <Link to={`/products?category=${cat._id}`} className="group relative rounded-3xl overflow-hidden h-40 md:h-48 block cursor-pointer bg-slate-100 soft-shadow hover-soft-shadow transition-all duration-500 hover:-translate-y-2">
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-5">
                    <span className="text-white font-semibold text-lg leading-tight tracking-wide">{cat.name}</span>
                  </div>
                </Link>
              </Motion.div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-10">Đang tải danh mục...</div>
        )}
      </section>

      {/* Featured Products */}
      <section className="px-2">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Xu Hướng Mới</h2>
            <p className="text-slate-500 mt-3 text-lg">Cập nhật những công nghệ đột phá</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-blue-500 transition-colors group">
            Xem tất cả <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {isProductLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-slate-200 h-72 rounded-3xl"></div>
                <div className="bg-slate-200 h-5 w-3/4 rounded"></div>
                <div className="bg-slate-200 h-5 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 8).map((item, idx) => (
              <Motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                key={item._id} 
                className="group flex flex-col"
              >
                <Link to={`/product/${item._id}`} className="relative bg-white rounded-[2rem] overflow-hidden aspect-[4/5] mb-5 flex items-center justify-center p-8 transition-all duration-500 soft-shadow group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:-translate-y-2">
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300'} 
                    alt={item.name} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Quick add button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item._id, 1); }}
                    className="absolute bottom-5 left-5 right-5 glass text-primary font-semibold py-3.5 rounded-2xl opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                  >
                    <ShoppingBag size={20} />
                    <span>Thêm nhanh</span>
                  </button>
                </Link>
                
                <div className="flex flex-col flex-1 px-2">
                  <Link to={`/product/${item._id}`} className="text-slate-800 font-semibold line-clamp-2 hover:text-blue-500 transition-colors text-base md:text-lg leading-snug">
                    {item.name}
                  </Link>
                  <div className="mt-3 text-slate-900 font-bold text-lg md:text-xl">
                    {item.price.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

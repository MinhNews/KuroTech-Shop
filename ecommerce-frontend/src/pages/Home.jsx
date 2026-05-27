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
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[500px] flex items-center mt-6">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1920&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-10 md:px-20 max-w-3xl">
          <Motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            Nâng Tầm Trải Nghiệm <br/><span className="text-slate-300 font-light">Công Nghệ Của Bạn</span>
          </Motion.h1>
          <Motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light"
          >
            Khám phá bộ sưu tập thiết bị cao cấp được tuyển chọn khắt khe, mang đến sự tinh tế và hiệu suất vượt trội.
          </Motion.p>
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl">
              Khám Phá Ngay <ArrowRight size={20} />
            </Link>
          </Motion.div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Danh Mục Nổi Bật</h2>
            <p className="text-slate-500 mt-2">Tìm kiếm theo nhu cầu của bạn</p>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className="group relative rounded-2xl overflow-hidden h-32 md:h-40 cursor-pointer bg-slate-100 shadow-sm">
                {cat.image && (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-4">
                  <span className="text-white font-medium text-sm md:text-base leading-tight">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-10">Đang tải danh mục...</div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sản Phẩm Mới Nhất</h2>
            <p className="text-slate-500 mt-2">Cập nhật xu hướng công nghệ</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-1 text-primary font-medium hover:opacity-80 transition-opacity">
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
        
        {isProductLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-slate-200 h-64 rounded-2xl"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 8).map((item, idx) => (
              <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={item._id} 
                className="group flex flex-col"
              >
                <Link to={`/product/${item._id}`} className="relative bg-secondary/50 rounded-2xl overflow-hidden aspect-[4/5] mb-4 flex items-center justify-center p-6 transition-colors group-hover:bg-secondary">
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300'} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Quick add button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item._id, 1); }}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-primary font-medium py-3 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                  >
                    <ShoppingBag size={18} />
                    <span>Thêm nhanh</span>
                  </button>
                </Link>
                
                <div className="flex flex-col flex-1 px-1">
                  <Link to={`/product/${item._id}`} className="text-slate-800 font-medium line-clamp-2 hover:text-primary transition-colors text-sm md:text-base">
                    {item.name}
                  </Link>
                  <div className="mt-2 text-slate-900 font-semibold">
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

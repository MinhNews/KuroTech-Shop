// src/pages/ProductList.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, Filter } from 'lucide-react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import { motion } from 'framer-motion';
import axiosClient from '../api/axiosClient';

const Motion = motion;

const ProductList = () => {
  const { products, isLoading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const activeCategory = categoryParam || "all";

  useEffect(() => {
    fetchProducts();
    axiosClient.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, [fetchProducts]);

  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId === "all") {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryId);
    }
    setSearchParams(newParams);
  };

  // Lọc sản phẩm
  let filteredProducts = activeCategory === "all" 
    ? [...products] 
    : products.filter(p => p.category?._id === activeCategory); 

  if (searchParam) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  // Sắp xếp
  if (sortOrder === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // newest
    filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
    
  // Lấy tên danh mục đang chọn để hiển thị tiêu đề
  const activeCategoryName = searchParam 
    ? `Kết quả tìm kiếm cho "${searchParam}"`
    : activeCategory === "all" 
      ? "Tất cả sản phẩm" 
      : categories.find(c => c._id === activeCategory)?.name || "Danh mục";

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-20">
      
      {/* SIDEBAR LỌC */}
      <div className="w-full md:w-1/4 lg:w-1/5 flex flex-col gap-8">
        <div className="sticky top-24">
          <h3 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-2">
            <Filter size={16} /> Danh Mục
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <button 
                onClick={() => handleCategoryChange("all")}
                className={`text-left w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === "all" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                Tất cả
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button 
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`text-left w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeCategory === cat._id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col gap-6">
        
        {/* Header danh sách */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeCategoryName}
            </h1>
            <p className="text-slate-500 mt-1">{filteredProducts.length} sản phẩm</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">Sắp xếp:</span>
            <div className="relative">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:border-slate-400 text-sm font-medium cursor-pointer transition-colors hover:bg-slate-50"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao xuống Thấp</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid Sản Phẩm */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-slate-200 aspect-[4/5] rounded-2xl"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded"></div>
                <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              Không tìm thấy sản phẩm nào trong danh mục này.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
              {filteredProducts.map((item, idx) => (
                <Motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item._id} 
                  className="group flex flex-col"
                >
                  <Link to={`/product/${item._id}`} className="relative bg-secondary/50 rounded-2xl overflow-hidden aspect-[4/5] mb-4 flex items-center justify-center p-6 transition-colors group-hover:bg-secondary">
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300'} 
                      alt={item.name} 
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(item._id, 1); }}
                      className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-primary font-medium py-3 rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                    >
                      <ShoppingBag size={18} />
                      <span>Thêm nhanh</span>
                    </button>
                  </Link>
                  
                  <div className="flex flex-col flex-1 px-1">
                    <Link to={`/product/${item._id}`} className="text-slate-800 font-medium line-clamp-2 hover:text-primary transition-colors text-sm">
                      {item.name}
                    </Link>
                    <div className="mt-2 text-slate-900 font-semibold">
                      {item.price.toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;

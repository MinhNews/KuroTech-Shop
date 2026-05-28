import toast from 'react-hot-toast';
// src/pages/admin/ProductManage.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';
import useProductStore from '../../store/useProductStore';
import useAuthStore from '../../store/useAuthStore';
import axiosClient from '../../api/axiosClient';

const ProductManage = () => {
  const { products, fetchProducts, deleteProduct, createProduct, updateProduct, isLoading } = useProductStore();
  const { user } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    brand: '',
    imageFiles: null
  });

  useEffect(() => {
    fetchProducts();
    // Lấy danh sách danh mục và thương hiệu
    axiosClient.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    axiosClient.get('/brands').then(res => setBrands(res.data)).catch(console.error);
  }, [fetchProducts]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        category: product.category?._id || '',
        brand: product.brand?._id || '',
        imageFiles: null
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', stock: '', description: '', category: '', brand: '', imageFiles: null });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('name', formData.name);
      dataToSubmit.append('price', Number(formData.price));
      dataToSubmit.append('stock', Number(formData.stock));
      dataToSubmit.append('description', formData.description);
      if (formData.category) {
        dataToSubmit.append('category', formData.category);
      }
      if (formData.brand) {
        dataToSubmit.append('brand', formData.brand);
      }
      
      // Đính kèm danh sách file ảnh để multer backend xử lý
      if (formData.imageFiles) {
        Array.from(formData.imageFiles).forEach(file => {
          dataToSubmit.append('images', file);
        });
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, dataToSubmit);
      } else {
        await createProduct(dataToSubmit);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error(error);
        toast.error("Xóa thất bại!");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sản phẩm</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-sm"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">Giá bán</th>
                <th className="p-4 font-medium">Tồn kho</th>
                <th className="p-4 font-medium">Thương hiệu</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Không có sản phẩm nào.</td></tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">ID: {product._id.substring(product._id.length - 6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {product.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {product.brand?.name || '---'}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {product.category?.name || '---'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên sản phẩm</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Giá bán (₫)</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tồn kho</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 bg-white"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Thương hiệu</label>
                    <select 
                      required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 bg-white"
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hình ảnh (Chọn nhiều file)</label>
                    <input 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={e => setFormData({...formData, imageFiles: e.target.files})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100" 
                    />
                    {editingProduct && editingProduct.images?.length > 0 && !formData.imageFiles && (
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <ImageIcon size={12} /> Sản phẩm đang có {editingProduct.images.length} ảnh
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button disabled={isUploading} onClick={handleCloseModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                Hủy
              </button>
              <button disabled={isUploading} type="submit" form="productForm" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? 'Đang tải lên...' : (editingProduct ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;

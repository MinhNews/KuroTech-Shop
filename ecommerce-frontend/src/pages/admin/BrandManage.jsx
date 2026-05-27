// src/pages/admin/BrandManage.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, Bookmark } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const BrandManage = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/brands');
      setBrands(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || ''
      });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await axiosClient.put(`/brands/${editingBrand._id}`, formData);
      } else {
        await axiosClient.post('/brands', formData);
      }
      fetchBrands();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      try {
        await axiosClient.delete(`/brands/${id}`);
        fetchBrands();
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại!");
      }
    }
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center surface-card p-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink flex items-center gap-2">
            <Bookmark size={24} className="text-primary" />
            Thương Hiệu
          </h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý các thương hiệu sản phẩm</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary px-5 py-2.5"
        >
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      <div className="admin-table-wrap">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Tìm kiếm thương hiệu..." 
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
                <th className="p-4 font-medium w-1/4">Tên thương hiệu</th>
                <th className="p-4 font-medium w-1/2">Mô tả</th>
                <th className="p-4 font-medium text-right w-1/4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredBrands.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-slate-500">Chưa có thương hiệu nào.</td></tr>
              ) : (
                filteredBrands.map(brand => (
                  <tr key={brand._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{brand.name}</td>
                    <td className="p-4 text-sm text-slate-600 line-clamp-1">{brand.description || '---'}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(brand)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(brand._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="surface-card shadow-lift w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">
                {editingBrand ? 'Cập Nhật Thương Hiệu' : 'Thêm Thương Hiệu'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="brandForm" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên thương hiệu</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                Hủy
              </button>
              <button type="submit" form="brandForm" className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm">
                Lưu Thương Hiệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManage;

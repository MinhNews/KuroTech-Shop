import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Power } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const CouponManage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ code: '', discountPercent: '' });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/coupons');
      setCoupons(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosClient.post('/coupons', {
        code: formData.code.toUpperCase(),
        discountPercent: Number(formData.discountPercent)
      });
      setFormData({ code: '', discountPercent: '' });
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi tạo mã giảm giá!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axiosClient.put(`/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật trạng thái!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      await axiosClient.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert("Lỗi xóa mã!");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center surface-card p-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Mã Giảm Giá</h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý các chương trình khuyến mãi, voucher</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form tạo mới */}
        <div className="lg:w-1/3">
          <div className="surface-card p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-primary" /> Thêm Mã Mới
            </h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mã code (Ví dụ: SUMMER20)</label>
                <input 
                  required 
                  type="text" 
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500 uppercase" 
                  placeholder="Nhập mã code..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phần trăm giảm (%)</label>
                <input 
                  required 
                  type="number" 
                  min="1" max="100"
                  value={formData.discountPercent}
                  onChange={e => setFormData({...formData, discountPercent: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-500" 
                  placeholder="Nhập % giảm giá..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2"
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo Mã Giảm Giá'}
              </button>
            </form>
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="lg:w-2/3">
          <div className="admin-table-wrap">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-medium">Mã CODE</th>
                    <th className="p-4 font-medium">Mức giảm</th>
                    <th className="p-4 font-medium">Trạng thái</th>
                    <th className="p-4 font-medium text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
                  ) : coupons.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">Chưa có mã giảm giá nào.</td></tr>
                  ) : (
                    coupons.map(item => (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                              <Ticket size={20} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-lg tracking-wider">{item.code}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-red-500 text-lg">-{item.discountPercent}%</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {item.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleToggle(item._id)} 
                              className={`p-2 rounded-lg transition-colors ${item.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                              title={item.isActive ? "Tạm ngưng mã này" : "Kích hoạt mã này"}
                            >
                              <Power size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id)} 
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa mã"
                            >
                              <Trash2 size={18} />
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
        </div>
      </div>
    </div>
  );
};

export default CouponManage;

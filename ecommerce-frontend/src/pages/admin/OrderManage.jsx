// src/pages/admin/OrderManage.jsx
import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Eye } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosClient.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại!");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center surface-card p-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink flex items-center gap-2">
            <ShoppingCart size={24} className="text-primary" />
            Đơn Hàng
          </h2>
          <p className="text-slate-500 text-sm mt-1">Quản lý các đơn đặt hàng từ khách</p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo ID đơn hoặc email khách hàng..." 
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
                <th className="p-4 font-medium">Mã đơn hàng</th>
                <th className="p-4 font-medium">Khách hàng</th>
                <th className="p-4 font-medium">Ngày đặt</th>
                <th className="p-4 font-medium">Tổng tiền</th>
                <th className="p-4 font-medium">Thanh toán</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Chưa có đơn hàng nào.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-800">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-800">{order.user?.username || 'Khách vãng lai'}</div>
                      <div className="text-xs text-slate-500">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    
                    <td className="p-4 font-medium text-slate-700">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="p-4">
                      {order.paymentMethod === 'Banking' ? (
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded whitespace-nowrap">Chuyển khoản</span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded whitespace-nowrap">COD</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                        className={`text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary bg-white ${
                          (order.status === 'Delivered' || order.status === 'Cancelled') ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
                        }`}
                      >
                        {order.status === 'Pending' && <option value="Pending">Chờ duyệt</option>}
                        {(order.status === 'Pending' || order.status === 'Processing') && <option value="Processing">Đang xử lý</option>}
                        {(order.status === 'Pending' || order.status === 'Processing' || order.status === 'Shipped') && <option value="Shipped">Đang giao</option>}
                        <option value="Delivered">Đã giao hàng</option>
                        <option value="Cancelled">Hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManage;

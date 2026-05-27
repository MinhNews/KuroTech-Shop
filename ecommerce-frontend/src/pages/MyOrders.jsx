// src/pages/MyOrders.jsx
import { useEffect, useState } from 'react';
import { Package, MapPin, CheckCircle, Clock, Truck, XCircle, ChevronLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import useAuthStore from '../store/useAuthStore';

const MyOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axiosClient.get('/orders/my-orders')
        .then(res => {
          setOrders(res.data);
        })
        .catch(err => {
          console.error("Lỗi lấy lịch sử đơn hàng", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="text-yellow-500" size={20} />;
      case 'Processing': return <Package className="text-blue-500" size={20} />;
      case 'Shipped': return <Truck className="text-indigo-500" size={20} />;
      case 'Delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'Cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đang giao hàng';
      case 'Delivered': return 'Đã giao thành công';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500">Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mb-6">
        <ChevronLeft size={20} />
        Tiếp tục mua sắm
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase flex items-center gap-2">
        <Package className="text-primary" />
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
          <Package size={60} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Bạn chưa có đơn hàng nào</h2>
          <p className="text-slate-500 mb-6">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi nhé!</p>
          <Link to="/products" className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primaryHover transition-colors">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-800 mb-1">
                    Mã đơn: <span className="text-primary">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusBg(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="p-6 flex flex-col md:flex-row gap-6">
                
                <div className="flex-1 border-r md:pr-6 border-slate-100 last:border-0">
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400" /> Thông tin giao hàng
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {order.shippingAddress}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                    <span className="text-slate-500 block mb-1">Thanh toán:</span>
                    <span className="font-medium text-slate-800">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thẻ tín dụng'}</span>
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex flex-col justify-center bg-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-slate-500 mb-1 text-center">Tổng thanh toán</div>
                  <div className="text-3xl font-bold text-red-500 text-center">
                    {order.totalAmount.toLocaleString('vi-VN')} ₫
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

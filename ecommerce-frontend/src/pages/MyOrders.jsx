import { useEffect, useState } from 'react';
import { Package, MapPin, CheckCircle, Clock, Truck, XCircle, ChevronLeft, ChevronDown, ChevronUp, QrCode } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [viewingQrForOrder, setViewingQrForOrder] = useState(null);

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

  // Các bước trạng thái chuẩn (không tính Cancelled)
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  
  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500">Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
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
          {orders.map(order => {
            const currentStep = getStepIndex(order.status);
            const isCancelled = order.status === 'Cancelled';
            const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
            const extraItemsCount = order.items ? order.items.length - 1 : 0;

            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Header đơn hàng */}
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

                {/* Progress Bar */}
                <div className="p-6 border-b border-slate-100">
                  {isCancelled ? (
                    <div className="text-center py-4 text-red-500 font-medium bg-red-50 rounded-lg">
                      <XCircle className="mx-auto mb-2" size={32} />
                      Đơn hàng đã bị hủy
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto my-4">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full z-0 transition-all duration-500"
                        style={{ width: `${currentStep >= 0 ? (currentStep / 3) * 100 : 0}%` }}
                      ></div>
                      
                      {steps.map((step, idx) => (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${currentStep >= idx ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-500/30' : 'bg-white border-gray-300 text-gray-300'}`}>
                            {idx === 0 && <Clock size={16} />}
                            {idx === 1 && <Package size={16} />}
                            {idx === 2 && <Truck size={16} />}
                            {idx === 3 && <CheckCircle size={16} />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase hidden sm:block ${currentStep >= idx ? 'text-green-600' : 'text-gray-400'}`}>
                            {getStatusText(step)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sản phẩm đại diện (nếu có) */}
                {firstItem && (
                  <div className="p-6 pb-2">
                    <div className="flex items-center gap-4">
                      <img src={firstItem.product.images[0] || 'https://via.placeholder.com/150'} alt={firstItem.product.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 line-clamp-1">{firstItem.product.name}</h4>
                        <p className="text-sm text-slate-500">x{firstItem.quantity}</p>
                      </div>
                      <div className="font-bold text-slate-800 whitespace-nowrap">
                        {firstItem.priceAtPurchase.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  </div>
                )}

                {/* Nút Xem chi tiết */}
                <div className="px-6 py-2">
                  <button 
                    onClick={() => toggleExpand(order._id)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-blue-700 py-3 border-t border-slate-100 transition-colors"
                  >
                    {expandedOrder === order._id ? (
                      <>Thu gọn <ChevronUp size={16} /></>
                    ) : (
                      <>
                        Xem thêm chi tiết {extraItemsCount > 0 ? `(${extraItemsCount} sản phẩm khác)` : ''} 
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Phần mở rộng chi tiết */}
                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50"
                    >
                      <div className="p-6 border-t border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm">Danh sách sản phẩm</h3>
                        <div className="flex flex-col gap-4 mb-6">
                          {order.items && order.items.map(item => (
                            <div key={item._id} className="flex gap-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                              <img src={item.product.images[0] || 'https://via.placeholder.com/150'} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg border border-slate-100" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 line-clamp-2 leading-tight mb-1">{item.product.name}</h4>
                                <p className="text-sm text-slate-500">Số lượng: <span className="font-medium text-slate-700">{item.quantity}</span></p>
                              </div>
                              <div className="font-bold text-red-500 text-right">
                                {(item.priceAtPurchase * item.quantity).toLocaleString('vi-VN')} ₫
                                <p className="text-xs text-slate-400 font-normal mt-1">Đơn giá: {item.priceAtPurchase.toLocaleString('vi-VN')} ₫</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2 text-sm uppercase">
                              <MapPin size={16} className="text-primary" /> Thông tin nhận hàng
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {order.shippingAddress}
                            </p>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                              <span className="text-slate-500 block mb-1">Phương thức thanh toán:</span>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-800">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản Ngân hàng'}</span>
                                {order.paymentMethod === 'Banking' && order.status === 'Pending' && (
                                  <button onClick={() => setViewingQrForOrder(order)} className="text-primary hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                    <QrCode size={14} /> Xem mã QR
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="w-full md:w-1/3 flex flex-col justify-center bg-blue-50 border border-blue-100 p-4 rounded-xl">
                            <div className="text-sm text-slate-600 mb-1 text-center font-medium">Tổng thanh toán</div>
                            <div className="text-3xl font-bold text-primary text-center">
                              {order.totalAmount.toLocaleString('vi-VN')} ₫
                            </div>
                            <div className="text-center mt-2">
                              {/* Đã xóa trạng thái thanh toán riêng */}
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal hiển thị mã QR */}
      <AnimatePresence>
        {viewingQrForOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingQrForOrder(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setViewingQrForOrder(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <XCircle size={24} />
              </button>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Thanh toán đơn hàng</h3>
                <p className="text-sm text-slate-500 mb-6">Mã đơn: <span className="font-bold text-slate-700">#{viewingQrForOrder._id.substring(viewingQrForOrder._id.length - 8).toUpperCase()}</span></p>
                
                <div className="bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200 inline-block mb-6">
                  <img 
                    src={`https://img.vietqr.io/image/vietinbank-0822770286-compact2.png?amount=${viewingQrForOrder.totalAmount}&addInfo=${encodeURIComponent('Thanh toan don hang ' + viewingQrForOrder._id.substring(viewingQrForOrder._id.length - 8).toUpperCase())}&accountName=${encodeURIComponent('NGUYEN DUC MINH')}`} 
                    alt="VietQR" 
                    className="w-48 h-48 md:w-56 md:h-56 object-contain rounded-2xl mix-blend-multiply" 
                  />
                </div>

                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-left text-sm">
                  <p className="font-bold mb-1">Thông tin chuyển khoản:</p>
                  <p>Số TK: <span className="font-semibold">0822770286</span> (VietinBank)</p>
                  <p>Số tiền: <span className="font-semibold text-red-500">{viewingQrForOrder.totalAmount.toLocaleString('vi-VN')} ₫</span></p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;

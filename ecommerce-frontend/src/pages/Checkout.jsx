// src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle, ChevronLeft } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import axiosClient from '../api/axiosClient';

const Checkout = () => {
  const { cart, isLoading, fetchCart } = useCartStore();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState({ code: '', discountPercent: 0 });
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && !cart) {
    return <div className="text-center py-20 text-gray-500">Đang tải thông tin...</div>;
  }

  // Nếu giỏ hàng trống và chưa đặt hàng xong
  if ((!cart || !cart.items || cart.items.length === 0) && !isSuccess) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="text-primary hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Build shippingAddress from parts (simplified for now)
      const fullAddress = `${formData.fullName} - ${formData.phone} - ${formData.address} ${formData.note ? `(Ghi chú: ${formData.note})` : ''}`;
      
      const res = await axiosClient.post('/orders/checkout', {
        shippingAddress: fullAddress,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon.code || undefined
      });

      setOrderId(res.data.orderId);
      setOrderTotal(finalTotalAmount);
      setIsSuccess(true);
      fetchCart(); // Xóa giỏ hàng local bằng cách fetch lại
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // MÀN HÌNH ĐẶT HÀNG THÀNH CÔNG
  if (isSuccess) {
    if (paymentMethod === 'Banking') {
      const bankId = 'vietinbank';
      const accountNo = '0822770286';
      const accountName = 'NGUYEN DUC MINH';
      const description = `Thanh toan don hang ${orderId.substring(orderId.length - 8).toUpperCase()}`;
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${orderTotal}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

      return (
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Đặt hàng thành công!</h2>
            <p className="text-slate-500 mb-8">Vui lòng quét mã QR dưới đây bằng ứng dụng ngân hàng để thanh toán đơn hàng.</p>
            
            <div className="bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-200 mb-8 inline-block">
              <img src={qrUrl} alt="VietQR" className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl mix-blend-multiply" />
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 w-full max-w-sm text-left">
              <p className="font-bold mb-2">Thông tin chuyển khoản thủ công:</p>
              <p className="text-sm">Ngân hàng: <span className="font-semibold">VietinBank</span></p>
              <p className="text-sm">Số tài khoản: <span className="font-semibold">{accountNo}</span></p>
              <p className="text-sm">Chủ tài khoản: <span className="font-semibold">{accountName}</span></p>
              <p className="text-sm">Số tiền: <span className="font-semibold text-red-500">{orderTotal.toLocaleString('vi-VN')} ₫</span></p>
              <p className="text-sm">Nội dung CK: <span className="font-semibold bg-white px-2 py-0.5 rounded text-black">{description}</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/products" className="flex-1 bg-white border-2 border-primary text-primary font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors">
                Tiếp tục mua sắm
              </Link>
              <Link to="/my-orders" className="flex-1 bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primaryHover transition-colors shadow-lg shadow-blue-500/30">
                Tôi đã chuyển khoản
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Đặt hàng thành công!</h2>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          Cảm ơn bạn đã mua sắm tại KuroTech. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-8 w-full max-w-md text-sm border mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Mã đơn hàng:</span>
            <span className="font-bold text-gray-800">#{orderId.substring(orderId.length - 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Phương thức thanh toán:</span>
            <span className="font-bold text-gray-800">{paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản Ngân hàng'}</span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/products" className="bg-white border-2 border-primary text-primary font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
            Tiếp tục mua sắm
          </Link>
          <Link to="/my-orders" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primaryHover transition-colors shadow-md">
            Xem đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const baseTotalAmount = cart?.totalAmount || 0;
  const discountAmount = appliedCoupon.discountPercent > 0 
    ? (baseTotalAmount * appliedCoupon.discountPercent) / 100 
    : 0;
  const finalTotalAmount = baseTotalAmount - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const res = await axiosClient.post('/coupons/apply', { code: couponInput });
      setAppliedCoupon({
        code: couponInput.toUpperCase(),
        discountPercent: res.data.discountPercent
      });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Mã giảm giá không hợp lệ");
      setAppliedCoupon({ code: '', discountPercent: 0 });
    }
  };

  // MÀN HÌNH THANH TOÁN (CHECKOUT FORM)
  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mb-6">
        <ChevronLeft size={20} />
        Quay lại giỏ hàng
      </Link>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-8 uppercase flex items-center gap-2">
        <ShieldCheck className="text-primary" />
        Thanh toán an toàn
      </h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
        
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          
          {/* 1. Thông tin giao hàng */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <MapPin className="text-gray-500" />
              Thông tin nhận hàng
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Nhập họ tên của bạn" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Nhập số điện thoại" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                <textarea rows="3" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Ghi chú thêm cho người giao hàng..." className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* 2. Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
              <CreditCard className="text-gray-500" />
              Phương thức thanh toán
            </h2>
            
            <div className="flex flex-col gap-4">
              {/* COD */}
              <label className={`border-2 p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary/50'}`}>
                <input 
                  type="radio" name="payment" value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                  className="w-5 h-5 accent-primary cursor-pointer" 
                />
                <div className="flex items-center gap-3">
                  <Banknote className="text-green-600" />
                  <div>
                    <div className="font-bold text-gray-800">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi shipper giao hàng tới</div>
                  </div>
                </div>
              </label>

              {/* Banking (QR) */}
              <label className={`border-2 p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'Banking' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-primary/50'}`}>
                <input 
                  type="radio" name="payment" value="Banking" 
                  checked={paymentMethod === 'Banking'} 
                  onChange={() => setPaymentMethod('Banking')}
                  className="w-5 h-5 accent-primary cursor-pointer" 
                />
                <div className="flex items-center gap-3">
                  <CreditCard className="text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-800">Chuyển khoản Ngân hàng (Mã QR)</div>
                    <div className="text-sm text-gray-500">Mã QR động sẽ hiện ra sau khi bạn ấn đặt hàng</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* CỘT PHẢI: HÓA ĐƠN & NÚT ĐẶT HÀNG */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Đơn hàng của bạn</h2>
            
            {/* List sản phẩm nhỏ gọn */}
            <div className="flex flex-col gap-4 mb-6">
              {cart?.items?.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.product?.images?.[0] || 'https://via.placeholder.com/64'} alt={item.product?.name} className="w-16 h-16 object-cover rounded border" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 line-clamp-2">{item.product?.name}</div>
                    <div className="text-sm font-bold text-primary mt-1">{(item.product?.price * item.quantity).toLocaleString('vi-VN')} ₫</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-4">
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Mã giảm giá..." 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase" 
                />
                <button 
                  type="button" 
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 text-white px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm"
                >
                  Áp dụng
                </button>
              </div>

              <div className="flex justify-between mb-3 text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{baseTotalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium">Miễn phí</span>
              </div>
              {appliedCoupon.discountPercent > 0 && (
                <div className="flex justify-between mb-3 text-green-600 font-medium">
                  <span>Khuyến mãi ({appliedCoupon.code} -{appliedCoupon.discountPercent}%)</span>
                  <span>- {discountAmount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mb-8 border-t pt-4">
              <span className="text-lg font-bold text-gray-800">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-red-500">{finalTotalAmount.toLocaleString('vi-VN')} ₫</span>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-primary text-white font-bold text-lg py-4 rounded-lg hover:bg-primaryHover shadow-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Thông tin của bạn được bảo mật tuyệt đối
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;

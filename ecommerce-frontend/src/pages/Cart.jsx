// src/pages/Cart.jsx
import { useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const Cart = () => {
  const { cart, isLoading, fetchCart, removeFromCart, updateQuantity } = useCartStore();

  // Load giỏ hàng khi vào trang
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Nếu đang load
  if (isLoading && !cart) {
    return <div className="text-center py-20 text-gray-500">Đang tải giỏ hàng...</div>;
  }

  // Nếu giỏ hàng trống hoặc chưa đăng nhập
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-8">
        <ShoppingBag size={80} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy chọn thêm sản phẩm để mua sắm nhé!</p>
        <Link to="/" className="bg-primary text-white font-medium py-3 px-8 rounded-lg hover:bg-primaryHover transition-colors shadow-md">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase flex items-center gap-2">
        <ShoppingBag className="text-primary" />
        Giỏ hàng của bạn
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          
          <div className="hidden md:flex bg-white p-4 rounded-lg shadow-sm font-medium text-gray-600 border border-gray-100">
            <div className="w-2/5">Sản phẩm</div>
            <div className="w-1/5 text-center">Đơn giá</div>
            <div className="w-1/5 text-center">Số lượng</div>
            <div className="w-1/5 text-right">Thành tiền</div>
            <div className="w-10"></div>
          </div>

          {/* Duyệt mảng cart.items thật từ Backend */}
          {cart.items.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
              
              {/* Ảnh & Tên (Dữ liệu từ .populate('product')) */}
              <div className="md:w-2/5 flex items-center gap-4">
                <img 
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                  alt={item.product?.name} 
                  className="w-20 h-20 object-cover rounded border" 
                />
                <Link to={`/product/${item.product?._id}`} className="font-medium text-gray-800 hover:text-primary line-clamp-2">
                  {item.product?.name}
                </Link>
              </div>

              {/* Đơn giá */}
              <div className="md:w-1/5 text-center font-medium text-gray-600">
                {item.product?.price.toLocaleString('vi-VN')} ₫
              </div>

              {/* Số lượng */}
              <div className="md:w-1/5 flex justify-center">
                <div className="flex items-center border border-gray-300 rounded bg-white overflow-hidden w-28">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-1/3 py-1 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-1/3 text-center font-medium py-1">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-1/3 py-1 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Thành tiền */}
              <div className="md:w-1/5 text-right font-bold text-red-500">
                {(item.product?.price * item.quantity).toLocaleString('vi-VN')} ₫
              </div>

              {/* Nút xóa */}
              <div className="w-10 flex justify-end">
                <button 
                  onClick={() => removeFromCart(item._id)} 
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))}

          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium mt-4 w-max">
            <ArrowLeft size={16} />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Tạm tính</span>
              <span className="font-medium">{cart.totalAmount?.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <div className="flex justify-between mb-6 border-t pt-4">
              <span className="text-lg font-bold text-gray-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-red-500">{cart.totalAmount?.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="w-full block text-center bg-primary text-white font-bold py-3 rounded-lg hover:bg-primaryHover shadow-md transition-colors"
            >
              Tiến hành đặt hàng
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;

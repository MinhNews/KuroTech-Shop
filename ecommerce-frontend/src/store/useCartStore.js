// src/store/useCartStore.js
import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useCartStore = create((set, get) => ({
  cart: null, // Sẽ chứa { items: [], totalAmount: 0 } từ Backend
  isLoading: false,

  // 1. LẤY GIỎ HÀNG TỪ SERVER
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosClient.get('/cart');
      set({ cart: response.data, isLoading: false });
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng", error);
      set({ isLoading: false });
    }
  },

  // 2. THÊM SẢN PHẨM VÀO GIỎ
  addToCart: async (productId, quantity) => {
    try {
      await axiosClient.post('/cart', { productId, quantity });
      
      // Thêm xong thì gọi lại hàm fetchCart để cập nhật con số ngay lập tức
      get().fetchCart(); 
      alert("Đã thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error(error);
      alert("Bạn cần đăng nhập để mua hàng!");
    }
  },

  // 3. XÓA SẢN PHẨM KHỎI GIỎ
  removeFromCart: async (cartItemId) => {
    try {
      await axiosClient.delete(`/cart/${cartItemId}`);
      get().fetchCart(); // Cập nhật lại giỏ hàng
    } catch (error) {
      console.error("Lỗi xóa sản phẩm", error);
    }
  },

  // 4. CẬP NHẬT SỐ LƯỢNG
  updateQuantity: async (cartItemId, quantity) => {
    if (quantity <= 0) return;
    try {
      await axiosClient.put(`/cart/${cartItemId}`, { quantity });
      get().fetchCart();
    } catch (error) {
      console.error("Lỗi cập nhật số lượng", error);
    }
  }
}));

export default useCartStore;
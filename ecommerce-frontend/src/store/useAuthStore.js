// src/store/useAuthStore.js
import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useAuthStore = create((set) => ({
  // Lấy dữ liệu từ LocalStorage ra nếu người dùng đã đăng nhập từ trước (tránh F5 bị mất đăng nhập)
  user: JSON.parse(localStorage.getItem('user')) || null, 
  isLoading: false,
  error: null,

  // 1. HÀM ĐĂNG NHẬP
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      
      const { accessToken, user } = response.data;
      
      // Lưu Token và User vào LocalStorage để dùng dần
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Cập nhật State
      set({ user: user, isLoading: false });
      return true; // Trả về true để Frontend biết đường chuyển trang
    } catch (error) {
      // Bắt lỗi từ Backend gửi lên (Sai pass, sai email...)
      set({ 
        error: error.response?.data?.message || "Lỗi kết nối đến server", 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Gọi API Đăng ký của Backend (Đã trả về token tự đăng nhập)
      const response = await axiosClient.post('/auth/register', { username, email, password });
      
      const { accessToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user: user, isLoading: false });
      return true; // Báo hiệu đăng ký thành công
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Lỗi kết nối đến server", 
        isLoading: false 
      });
      return false;
    }
  },

  // 1.5 ĐĂNG NHẬP GOOGLE
  googleLogin: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post('/auth/google-login', { token });
      
      const { accessToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user: user, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || "Lỗi đăng nhập Google", 
        isLoading: false 
      });
      return false;
    }
  },

  // Cập nhật thông tin user sau khi chỉnh profile/avatar
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // 2. HÀM ĐĂNG XUẤT
  logout: async () => {
    try {
      await axiosClient.post('/auth/logout'); // Gọi API để Backend xóa Cookie
      // Dọn dẹp LocalStorage và State
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      set({ user: null });
    } catch (error) {
      console.error("Lỗi đăng xuất", error);
    }
  }
}));

export default useAuthStore;
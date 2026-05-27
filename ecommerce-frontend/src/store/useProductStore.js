import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

const useProductStore = create((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/products'); 
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null, currentProduct: null });
    try {
      const response = await axiosClient.get(`/products/${id}`); 
      set({ currentProduct: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.post('/products', productData);
      set((state) => ({ products: [...state.products, response.data.data], isLoading: false }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.put(`/products/${id}`, productData);
      set((state) => ({
        products: state.products.map(p => p._id === id ? response.data.data : p),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter(p => p._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useProductStore;

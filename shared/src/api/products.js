import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const productsAPI = {
  getAll: async (category = '', search = '', page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE}/products`, {
        params: { category, search, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  create: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE}/products`, productData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  update: async (id, productData) => {
    try {
      const response = await axios.put(`${API_BASE}/products/${id}`, productData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/products/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  toggleLike: async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/products/${productId}/like`,
        {},
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
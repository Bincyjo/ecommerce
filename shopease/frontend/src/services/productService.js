import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  async createProduct(formData) {
    const response = await api.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProduct(id, formData) {
    const response = await api.put(`/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
  },
};

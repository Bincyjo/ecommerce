import api from './api';

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders/');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  async createOrder(orderData) {
    // orderData can be { items: [{ product_id, quantity }] } or { product_id, quantity }
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  async completeOrder(id) {
    const response = await api.patch(`/orders/${id}/complete/`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/orders/dashboard-stats/');
    return response.data;
  },
};

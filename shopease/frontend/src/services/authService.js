import api from './api';

export const authService = {
  async register(username, email, password, confirmPassword) {
    const response = await api.post('/auth/register/', {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    });
    return response.data;
  },

  async login(username, password) {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    return response.data;
  },

  async logout(refreshToken) {
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

import api from '@/api/axios';

export const authService = {
  register:      (data)          => api.post('/auth/register', data),
  login:         (data)          => api.post('/auth/login', data),
  getMe:         ()              => api.get('/auth/me'),
  forgotPassword:(email)         => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, pass)   => api.post(`/auth/reset-password/${token}`, { password: pass }),
};

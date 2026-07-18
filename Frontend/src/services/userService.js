import api from '@/api/axios';

export const userService = {
  getAll:   (params) => api.get('/users', { params }),
  getById:  (id)     => api.get(`/users/${id}`),
  update:   (id, data) => api.put(`/users/${id}`, data),
  remove:   (id)     => api.delete(`/users/${id}`),
};

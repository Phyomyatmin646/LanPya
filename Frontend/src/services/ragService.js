import api from '@/api/axios';

export const ragService = {
  getDocuments:   ()           => api.get('/rag'),
  uploadDocument: (formData)   => api.post('/rag/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  query:          (query)      => api.post('/rag/query', { query }),
  deleteDocument: (id)         => api.delete(`/rag/${id}`),
};

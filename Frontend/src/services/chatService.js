import api from '@/api/axios';

export const chatService = {
  createSession: (title)      => api.post('/chat/sessions', { title: title || 'New Chat' }),
  getSessions:   ()           => api.get('/chat/sessions'),
  getHistory:    (sessionId)  => api.get(`/chat/sessions/${sessionId}/history`),
  sendMessage:   (sessionId, message) => api.post(`/chat/sessions/${sessionId}/message`, { message }),
  deleteSession: (sessionId)  => api.delete(`/chat/sessions/${sessionId}`),
};

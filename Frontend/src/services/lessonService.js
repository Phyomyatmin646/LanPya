import api from '@/api/axios';

export const lessonService = {
  getByModule: (moduleId)            => api.get(`/modules/${moduleId}/lessons`),
  getById:     (moduleId, lessonId)  => api.get(`/modules/${moduleId}/lessons/${lessonId}`),
  create:      (moduleId, data)      => api.post(`/modules/${moduleId}/lessons`, data),
  update:      (moduleId, id, data)  => api.put(`/modules/${moduleId}/lessons/${id}`, data),
  remove:      (moduleId, id)        => api.delete(`/modules/${moduleId}/lessons/${id}`),

  // Comments
  getComments: (lessonId)          => api.get(`/comments/lesson/${lessonId}`),
  addComment:  (lessonId, comment) => api.post(`/comments/lesson/${lessonId}`, { comment }),
  deleteComment:(id)               => api.delete(`/comments/${id}`),
};

export const bookmarkService = {
  getMyBookmarks: ()          => api.get('/bookmarks'),
  add:            (lessonId)  => api.post(`/bookmarks/lesson/${lessonId}`),
  remove:         (lessonId)  => api.delete(`/bookmarks/lesson/${lessonId}`),
};

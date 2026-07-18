import api from '@/api/axios';

export const notificationService = {
  getAll:       ()    => api.get('/notifications'),
  markRead:     (id)  => api.put(`/notifications/${id}/read`),
  markAllRead:  ()    => api.put('/notifications/read-all'),
  remove:       (id)  => api.delete(`/notifications/${id}`),
};

export const announcementService = {
  getAll:  ()     => api.get('/announcements'),
  create:  (data) => api.post('/announcements', data),
};

export const miscService = {
  search:                 (q)         => api.get('/search', { params: { q } }),
  getRecommendations:     ()          => api.get('/recommendations'),
  guestAssessment:        (data)      => api.post('/guest-assessment', data),
  getTrendingRoadmaps:    (limit = 6) => api.get('/trending-roadmaps', { params: { limit } }),
  getLeaderboard:         (limit = 10)=> api.get('/leaderboard', { params: { limit } }),
  getGuestRecommendations:(interests, limit = 6) => api.get('/guest-recommendations', { params: { interests: interests.join(','), limit } }),
};

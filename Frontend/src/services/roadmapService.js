import api from '@/api/axios';

export const roadmapService = {
  getAll:   (params)       => api.get('/roadmaps', { params }),
  getById:  (id)           => api.get(`/roadmaps/${id}`),
  getFullRoadmap: (id)     => api.get(`/roadmaps/${id}/full`),
  getCategoriesWithRoadmaps: () => api.get('/roadmaps/categories-with-roadmaps'),
  create:   (data)         => api.post('/roadmaps', data),
  saveCustom:(data)        => api.post('/roadmaps/save-custom', data),
  update:   (id, data)     => api.put(`/roadmaps/${id}`, data),
  remove:   (id)           => api.delete(`/roadmaps/${id}`),

  // Modules (nested under roadmap)
  getModules:    (roadmapId)           => api.get(`/roadmaps/${roadmapId}/modules`),
  createModule:  (roadmapId, data)     => api.post(`/roadmaps/${roadmapId}/modules`, data),
  updateModule:  (roadmapId, id, data) => api.put(`/roadmaps/${roadmapId}/modules/${id}`, data),
  deleteModule:  (roadmapId, id)       => api.delete(`/roadmaps/${roadmapId}/modules/${id}`),

  // Ratings
  getRatings: (roadmapId)       => api.get(`/ratings/roadmap/${roadmapId}`),
  rateRoadmap:(roadmapId, data) => api.post(`/ratings/roadmap/${roadmapId}`, data),
};

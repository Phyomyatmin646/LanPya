import api from '@/api/axios';

export const enrollmentService = {
  getMyEnrollments: () => api.get('/enrollments/my'),
  enroll:   (roadmapId) => api.post(`/enrollments/${roadmapId}`),
  unenroll: (roadmapId) => api.delete(`/enrollments/${roadmapId}`),
};

export const progressService = {
  markLesson:        (lessonId)  => api.post(`/progress/lesson/${lessonId}`),
  getRoadmapProgress:(roadmapId) => api.get(`/progress/roadmap/${roadmapId}`),
};

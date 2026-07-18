import api from '@/api/axios';

export const quizService = {
  getByLesson:  (lessonId)          => api.get(`/quizzes/lesson/${lessonId}`),
  create:       (lessonId, data)    => api.post(`/quizzes/lesson/${lessonId}`, data),
  addQuestion:  (quizId, data)      => api.post(`/quizzes/${quizId}/questions`, data),
  submit:       (quizId, answers)   => api.post(`/quizzes/${quizId}/submit`, { answers }),
  getAttempts:  (quizId)            => api.get(`/quizzes/${quizId}/attempts`),
};

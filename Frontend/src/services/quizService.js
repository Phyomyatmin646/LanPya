import api from '@/api/axios';

export const quizService = {
  getQuizByLesson: async (lessonId) => {
    return api.get(`/quizzes/lesson/${lessonId}`);
  },
  
  submitAttempt: async (quizId, answers) => {
    return api.post(`/quizzes/${quizId}/submit`, { answers });
  }
};

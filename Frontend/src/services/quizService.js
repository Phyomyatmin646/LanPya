import api from '@/api/axios';

export const quizService = {
  getQuizByLesson: async (lessonId) => {
    return api.get(`/quiz/lesson/${lessonId}`);
  },
  
  submitAttempt: async (quizId, answers) => {
    return api.post(`/quiz/${quizId}/submit`, { answers });
  }
};

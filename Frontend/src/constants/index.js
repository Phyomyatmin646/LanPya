export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
export const APP_NAME    = import.meta.env.VITE_APP_NAME    || 'LanPya';

export const TOKEN_KEY         = 'lanpya_token';
export const REFRESH_TOKEN_KEY = 'lanpya_refresh';
export const USER_KEY          = 'lanpya_user';

export const ROUTES = {
  HOME:             '/',
  LOGIN:            '/login',
  REGISTER:         '/register',
  FORGOT_PASSWORD:  '/forgot-password',
  RESET_PASSWORD:   '/reset-password/:token',

  DASHBOARD:        '/dashboard',
  PROFILE:          '/profile',
  SETTINGS:         '/settings',
  NOTIFICATIONS:    '/notifications',
  BOOKMARKS:        '/bookmarks',
  MY_LEARNING:      '/my-learning',
  RECOMMENDATIONS:  '/recommendations',

  ROADMAPS:         '/roadmaps',
  ROADMAP_DETAIL:   '/roadmaps/:id',
  LESSON_VIEW:      '/roadmaps/:roadmapId/modules/:moduleId/lessons/:lessonId',

  QUIZ:             '/lessons/:lessonId/quiz',
  CHAT:             '/chat',
  RAG_SEARCH:       '/rag-search',

  ADMIN:            '/admin',
  ADMIN_USERS:      '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ROADMAPS:   '/admin/roadmaps',
  ADMIN_ANNOUNCEMENTS: '/admin/announcements',
  ADMIN_RAG:        '/admin/rag',
};

export const DIFFICULTY = {
  beginner:     { label: 'Beginner',     color: 'badge-success', emoji: '🌱' },
  intermediate: { label: 'Intermediate', color: 'badge-warning', emoji: '🚀' },
  advanced:     { label: 'Advanced',     color: 'badge-danger',  emoji: '⚡' },
};

export const ENROLLMENT_STATUS = {
  enrolled:    { label: 'Enrolled',     color: 'badge-primary' },
  in_progress: { label: 'In Progress',  color: 'badge-info' },
  completed:   { label: 'Completed',    color: 'badge-success' },
  dropped:     { label: 'Dropped',      color: 'badge-danger' },
};

export const ROLE_COLORS = {
  admin:      'badge-danger',
  instructor: 'badge-secondary',
  student:    'badge-primary',
};

export const ITEMS_PER_PAGE = 10;

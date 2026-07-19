import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute, AdminRoute, HybridRoute } from '@/components/layout/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/ui/Skeleton';
import { Toaster } from 'react-hot-toast';

// ── Auth pages ────────────────────────────────────────────────
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage= lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// ── Guest pages ───────────────────────────────────────────────
const LandingPage       = lazy(() => import('@/pages/guest/LandingPage'));
const AssessmentPage    = lazy(() => import('@/pages/guest/AssessmentPage'));

// ── User pages ────────────────────────────────────────────────
const DashboardPage     = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProfilePage       = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage      = lazy(() => import('@/pages/profile/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const BookmarksPage     = lazy(() => import('@/pages/learning/BookmarksPage'));
const RecommendationsPage = lazy(() => import('@/pages/learning/RecommendationsPage'));
const MyLearningPage    = lazy(() => import('@/pages/learning/MyLearningPage'));

// ── Learning pages ────────────────────────────────────────────
const RoadmapsPage      = lazy(() => import('@/pages/learning/RoadmapsPage'));
const ExplorePage       = lazy(() => import('@/pages/learning/ExplorePage'));
const RoadmapDetailPage = lazy(() => import('@/pages/learning/RoadmapDetailPage'));
const LessonViewPage    = lazy(() => import('@/pages/learning/LessonViewPage'));
const QuizPage          = lazy(() => import('@/pages/learning/QuizPage'));

// ── AI / Chat pages ───────────────────────────────────────────
const ChatPage          = lazy(() => import('@/pages/chat/ChatPage'));
const RagSearchPage     = lazy(() => import('@/pages/chat/RagSearchPage'));

// ── Admin pages ───────────────────────────────────────────────
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminUsers        = lazy(() => import('@/pages/admin/UserManagementPage'));
const AdminCategories   = lazy(() => import('@/pages/admin/CategoryManagementPage'));
const AdminRoadmaps     = lazy(() => import('@/pages/admin/RoadmapManagementPage'));
const AdminAnnouncements= lazy(() => import('@/pages/admin/AdminAnnouncements'));
const AdminRag          = lazy(() => import('@/pages/admin/RagManagementPage'));

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-center" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Guest only routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>

          {/* Hybrid routes (Guests + Authenticated Users) */}
          <Route element={<HybridRoute />}>
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard"       element={<DashboardPage />} />
              <Route path="/explore"         element={<ExplorePage />} />
              <Route path="/roadmaps/:id"    element={<RoadmapDetailPage />} />
              <Route path="/roadmaps/:id/learn/:lessonId" element={<LessonViewPage />} />
              <Route path="/lessons/:lessonId/quiz" element={<QuizPage />} />
            </Route>
          </Route>

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/profile"         element={<ProfilePage />} />
              <Route path="/settings"        element={<SettingsPage />} />
              <Route path="/notifications"   element={<NotificationsPage />} />
              <Route path="/bookmarks"       element={<BookmarksPage />} />
              <Route path="/learning"        element={<MyLearningPage />} />
              <Route path="/chat"            element={<ChatPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin"                element={<AdminDashboard />} />
              <Route path="/admin/users"          element={<AdminUsers />} />
              <Route path="/admin/categories"     element={<AdminCategories />} />
              <Route path="/admin/roadmaps"       element={<AdminRoadmaps />} />
              <Route path="/admin/rag"            element={<AdminRag />} />
            </Route>
          </Route>

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

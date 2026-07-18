import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { miscService } from '../../services/miscService';
import { useAuth } from '../../hooks/useAuth';
import { useGuestStore } from '../../store/guestStore';
import {
  BookOpen, Activity, Star, Info, TrendingUp, Trophy,
  Medal, Sparkles, ArrowRight, Users, ChevronRight, Zap,
  CheckCircle, Award, Flame, MessageSquare, Play, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';

// ── Color theme ───────────────────────────────────────────────
// Primary dark  : #3E276D
// Accent purple : #8955F3
// White         : #FFFFFF
// Near-black    : #1F1F1F

// ── Unsplash images for roadmap cards ─────────────────────────
const CARD_IMAGES = {
  'web development':  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&q=80',
  'fullstack':        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&q=80',
  'full stack':       'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&q=80',
  'frontend':         'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&q=80',
  'react':            'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&q=80',
  'typescript':       'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&q=80',
  'backend':          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&q=80',
  'node':             'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&q=80',
  'api':              'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&q=80',
  'express':          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&q=80',
  'devops':           'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80',
  'cloud':            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80',
  'docker':           'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80',
  'ai & ml':          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&q=80',
  'machine learning': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&q=80',
  'artificial':       'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&q=80',
  'data science':     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80',
  'python':           'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&q=80',
  'data':             'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop&q=80',
];

function getCategoryImage(roadmap) {
  const haystack = [
    roadmap.title || '',
    roadmap.category_id?.name || '',
    roadmap.description || '',
  ].join(' ').toLowerCase();

  for (const [key, img] of Object.entries(CARD_IMAGES)) {
    if (haystack.includes(key)) return img;
  }
  const hash = [...(roadmap.title || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

// ── Mock data ─────────────────────────────────────────────────
const MOCK_ROADMAPS = [
  { _id: 'mock-1', title: 'Full Stack Web Dev', description: 'Master both frontend and backend development with React, Node.js, and PostgreSQL from scratch to production.', difficulty: 'primary', enrollment_count: 1243, category_id: { name: 'Web Development' }, isMock: true },
  { _id: 'mock-2', title: 'Machine Learning', description: 'Learn the core concepts of ML including supervised learning, neural networks, and model deployment with Python.', difficulty: 'advanced', enrollment_count: 987, category_id: { name: 'AI & ML' }, isMock: true },
  { _id: 'mock-3', title: 'DevOps & Cloud Engineering', description: 'Docker, Kubernetes, CI/CD pipelines, and AWS deployment strategies for modern software delivery.', difficulty: 'primary', enrollment_count: 754, category_id: { name: 'DevOps' }, isMock: true },
  { _id: 'mock-4', title: 'React & TypeScript Mastery', description: 'Build scalable, type-safe React applications with TypeScript, custom hooks, and state management.', difficulty: 'intermediate', enrollment_count: 1102, category_id: { name: 'Frontend' }, isMock: true },
  { _id: 'mock-5', title: 'Backend with Node.js & Express', description: 'REST APIs, authentication, database design, and microservices architecture with Node.js.', difficulty: 'intermediate', enrollment_count: 892, category_id: { name: 'Backend' }, isMock: true },
  { _id: 'mock-6', title: 'Python for Data Science', description: 'Pandas, NumPy, data visualization, and statistical analysis for aspiring data scientists.', difficulty: 'advanced', enrollment_count: 1560, category_id: { name: 'Data Science' }, isMock: true },
];

const MOCK_LEADERBOARD = [
  { rank: 1, username: 'aungsiphyo',   full_name: 'Aung Si Phyo',    completed_lessons: 142, avatar: '' },
  { rank: 2, username: 'zawmyolatt',   full_name: 'Zaw Myo Latt',    completed_lessons: 118, avatar: '' },
  { rank: 3, username: 'naylinoo',     full_name: 'Nay Lin Oo',      completed_lessons: 97,  avatar: '' },
  { rank: 4, username: 'thidarwin',    full_name: 'Thidar Win',       completed_lessons: 83,  avatar: '' },
  { rank: 5, username: 'kyawzinthant', full_name: 'Kyaw Zin Thant',  completed_lessons: 76,  avatar: '' },
  { rank: 6, username: 'eindrakyaw',   full_name: 'Eindra Kyaw',     completed_lessons: 65,  avatar: '' },
  { rank: 7, username: 'phyomyat',     full_name: 'Phyo Myat Min',   completed_lessons: 58,  avatar: '' },
  { rank: 8, username: 'linlinn',      full_name: 'Lin Lin',          completed_lessons: 47,  avatar: '' },
];

const MOCK_ACTIVITY = [
  { id: 1, icon: CheckCircle, color: 'text-emerald-400', text: 'Finished Lesson 4 in Python', user: 'Aung Si Phyo', time: '2 hours ago' },
  { id: 2, icon: Award,       color: 'text-amber-400',   text: 'Earned Intermediate Badge for SQL', user: 'Aung Si Phyo', time: '5 hours ago' },
  { id: 3, icon: Play,        color: 'text-[#8955F3]',   text: 'Started React Hooks Module', user: 'Aung Si Phyo', time: 'Yesterday' },
  { id: 4, icon: CheckCircle, color: 'text-emerald-400', text: 'Completed DevOps Basics', user: 'Aung Si Phyo', time: '2 days ago' },
];

const DIFF_LABELS = {
  primary:      { label: 'PRIMARY',      bg: 'bg-[#8955F3]',     text: 'text-white' },
  intermediate: { label: 'INTERMEDIATE', bg: 'bg-emerald-500',   text: 'text-white' },
  advanced:     { label: 'ADVANCED',     bg: 'bg-rose-500',      text: 'text-white' },
  beginner:     { label: 'BEGINNER',     bg: 'bg-blue-500',      text: 'text-white' },
};

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconColor, extra }) {
  return (
    <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 p-5 flex flex-col gap-3 min-w-0">
      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white leading-none">{value}</span>
        <div className="flex items-center gap-1">
          {extra && <span className="text-lg">{extra}</span>}
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

// ── Roadmap Card ──────────────────────────────────────────────
function RoadmapCard({ roadmap }) {
  const diff = DIFF_LABELS[roadmap.difficulty] || DIFF_LABELS.beginner;
  const href = roadmap.isMock ? '/explore' : `/roadmaps/${roadmap._id}`;
  const imgSrc = getCategoryImage(roadmap);

  return (
    <Link to={href} className="group block rounded-2xl overflow-hidden bg-[#2a2a2e] border border-white/5 hover:border-[#8955F3]/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-32 overflow-hidden">
        <img src={imgSrc} alt={roadmap.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2e] via-transparent to-transparent" />
        <span className={`absolute top-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded-md ${diff.bg} ${diff.text} tracking-wider`}>
          {diff.label}
        </span>
      </div>
      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">{roadmap.title}</h4>
        <p className="text-[11px] text-white/40 line-clamp-2 mb-3 leading-relaxed">{roadmap.description}</p>
        <button className="w-full text-center text-xs font-semibold text-[#8955F3] border border-[#8955F3]/30 rounded-lg py-2 hover:bg-[#8955F3]/10 transition-colors">
          View Path
        </button>
      </div>
    </Link>
  );
}

// ── Activity Feed Item ────────────────────────────────────────
function ActivityItem({ item }) {
  const Icon = item.icon;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className={`mt-0.5 ${item.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 leading-snug">{item.text}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-white/30">{item.user}</span>
          <span className="text-xs text-white/20">•</span>
          <span className="text-xs text-white/30">{item.time}</span>
        </div>
      </div>
    </div>
  );
}

// ── Leaderboard Podium (top 3) ────────────────────────────────
function LeaderboardPodium({ entries }) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 3) return null;

  // Reorder: 2nd, 1st, 3rd for visual podium
  const ordered = [top3[1], top3[0], top3[2]];
  const heights = ['h-16', 'h-24', 'h-12'];
  const positions = ['2nd', '1st', '3rd'];
  const colors = ['bg-gray-400', 'bg-amber-400', 'bg-orange-600'];

  return (
    <div className="flex items-end justify-center gap-2 mb-4 pt-2">
      {ordered.map((e, i) => (
        <div key={e.rank} className="flex flex-col items-center gap-1.5 w-20">
          <Avatar fallback={e.username} size="sm" src={e.avatar} />
          <span className="text-[10px] text-white/70 font-medium truncate w-full text-center">{e.full_name?.split(' ')[0]}</span>
          <div className={`w-full ${heights[i]} rounded-t-lg ${colors[i]}/20 border-t-2 ${colors[i].replace('bg-', 'border-')} flex flex-col items-center justify-center`}>
            <span className="text-white font-bold text-sm">{e.completed_lessons}</span>
            <span className="text-[8px] text-white/40">Lessons</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Leaderboard List (rank 4+) ────────────────────────────────
function LeaderboardList({ entries }) {
  return (
    <div className="space-y-0">
      {entries.slice(3).map(e => (
        <div key={e.rank} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
          <span className="text-xs text-white/30 font-bold w-5 text-right">{e.rank}</span>
          <Avatar fallback={e.username} size="xs" src={e.avatar} />
          <span className="text-xs text-white/70 flex-1 truncate">{e.full_name}</span>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#8955F3] rounded-full" style={{ width: `${Math.min((e.completed_lessons / 150) * 100, 100)}%` }} />
            </div>
            <span className="text-xs text-[#8955F3] font-bold w-6 text-right">{e.completed_lessons}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Shared data hook ──────────────────────────────────────────
function useDiscoveryData(interests = []) {
  const { data: recsResponse, isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations', interests.join(',')],
    queryFn: () => miscService.getGuestRecommendations(interests.length > 0 ? interests : ['programming'], 6),
  });
  const { data: trendingResponse, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-roadmaps'],
    queryFn: () => miscService.getTrendingRoadmaps(6),
  });
  const { data: leaderboardResponse, isLoading: lbLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => miscService.getLeaderboard(10),
  });

  const apiRecs     = recsResponse?.data?.data || [];
  const apiTrending = trendingResponse?.data?.data || [];
  const apiLb       = leaderboardResponse?.data?.data || [];

  return {
    roadmaps:    apiRecs.length     > 0 ? apiRecs     : MOCK_ROADMAPS,
    trending:    apiTrending.length > 0 ? apiTrending : MOCK_ROADMAPS.slice().reverse(),
    leaderboard: apiLb.length       > 0 ? apiLb       : MOCK_LEADERBOARD,
    recsLoading,
    trendingLoading,
    lbLoading,
  };
}

// ── Guest Dashboard ───────────────────────────────────────────
function GuestDashboard({ assessmentAnswers, generatedRoadmap }) {
  const interests = assessmentAnswers?.interests || [];
  const { roadmaps, trending, leaderboard, recsLoading, trendingLoading, lbLoading } = useDiscoveryData(interests);

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Guest banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#2a2a2e] border border-[#8955F3]/30">
          <div className="flex gap-3 items-start">
            <Info className="w-5 h-5 text-[#8955F3] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white text-sm">Exploring as Guest</h3>
              <p className="text-xs text-white/40">Create a free account to save progress and earn certificates.</p>
            </div>
          </div>
          <Link to="/register" className="bg-[#8955F3] hover:bg-[#7340e0] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all whitespace-nowrap">
            Create Free Account
          </Link>
        </div>

        {/* Hero */}
        <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 p-6 md:p-8">
          <div className="inline-flex items-center gap-2 bg-[#8955F3]/15 border border-[#8955F3]/30 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8955F3]" />
            <span className="text-xs font-medium text-[#8955F3]">AI-Generated Roadmap Ready</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{generatedRoadmap?.title}</h1>
          <p className="text-white/50 text-sm mb-5 max-w-2xl">{generatedRoadmap?.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {assessmentAnswers?.goal && <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">🎯 {assessmentAnswers.goal}</span>}
            {assessmentAnswers?.currentLevel && <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">📊 {assessmentAnswers.currentLevel}</span>}
            {interests.map(i => <span key={i} className="bg-[#8955F3]/15 text-[#8955F3] text-xs px-3 py-1 rounded-full border border-[#8955F3]/20">{i}</span>)}
          </div>
          <div className="flex gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#8955F3] hover:bg-[#7340e0] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
              <Zap className="w-4 h-4" /> Create Free Account
            </Link>
            <Link to="/explore" className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white text-sm px-5 py-2.5 rounded-xl transition-all">
              Browse All
            </Link>
          </div>
        </div>

        {/* Curated for You */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Curated for You</h2>
            <Link to="/explore" className="text-sm text-[#8955F3] hover:text-[#a47cf5] flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {recsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl opacity-20" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {roadmaps.map(r => <RoadmapCard key={r._id} roadmap={r} />)}
            </div>
          )}
        </div>

        {/* Trending */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Trending Roadmaps</h2>
            </div>
            <Link to="/explore" className="text-sm text-[#8955F3] hover:text-[#a47cf5] flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(trendingLoading ? [...Array(6)] : trending).map((r, i) =>
              trendingLoading ? <Skeleton key={i} className="h-56 rounded-2xl opacity-20" /> : <RoadmapCard key={r._id} roadmap={r} />
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Leaderboard</h2>
            <span className="text-xs text-white/30">Top Learners</span>
          </div>
          <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 overflow-hidden">
            {lbLoading ? (
              <div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full opacity-20" />)}</div>
            ) : (
              <>
                <LeaderboardPodium entries={leaderboard} />
                <LeaderboardList entries={leaderboard} />
                <div className="px-4 py-3 border-t border-white/5">
                  <Link to="/register" className="text-xs text-[#8955F3] hover:text-[#a47cf5] font-medium flex items-center gap-1">
                    Join and climb the leaderboard <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Auth Dashboard (matches reference design) ─────────────────
function AuthDashboard({ user, assessmentAnswers }) {
  const interests = assessmentAnswers?.interests || [];
  const { roadmaps, trending, leaderboard, recsLoading, trendingLoading, lbLoading } = useDiscoveryData(interests);

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back, {user.full_name?.split(' ')[0] || user.username}! 👋
            </h1>
            <p className="text-sm text-white/40 mt-1">AI-Powered Digital Learning</p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#2a2a2e] border border-white/5 rounded-xl px-4 py-2">
              <Avatar fallback={user.username} size="sm" src={user.avatar} />
              <div>
                <p className="text-sm font-semibold text-white">{user.full_name}</p>
                <p className="text-[10px] text-white/30">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Enrolled Courses" value="5"   icon={BookOpen}    iconColor="text-[#8955F3]" />
          <StatCard label="Completed Courses" value="2"  icon={Trophy}      iconColor="text-amber-400" />
          <StatCard label="Lessons Complete" value="124"  icon={CheckCircle} iconColor="text-emerald-400" />
          <StatCard label="Day Streak" value="36"         icon={Flame}       iconColor="text-orange-400" extra="🔥" />
        </div>

        {/* 3-Column Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left: My Current Path */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 p-5 h-full">
              <h3 className="text-sm font-bold text-white mb-4">My Current Path & Next Lesson</h3>

              <div className="rounded-xl bg-gradient-to-br from-[#3E276D] to-[#2a1a50] border border-[#8955F3]/30 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/80">Full Stack Web Dev</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#8955F3] text-white">PRIMARY</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#8955F3] rounded-full w-[65%]" />
                </div>
                <button className="w-full text-left text-xs font-medium text-[#8955F3] bg-[#8955F3]/15 border border-[#8955F3]/30 rounded-lg px-3 py-2 hover:bg-[#8955F3]/25 transition-colors flex items-center gap-2">
                  <Play className="w-3 h-3" /> Continue Learning: React Hooks →
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Python', 'Intermediate', 'Advanced'].map(t => (
                  <span key={t} className="text-[10px] text-white/40 border border-white/10 rounded-full px-2.5 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Recent Activity Feed */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 p-5 h-full">
              <h3 className="text-sm font-bold text-white mb-3">Recent Activity Feed</h3>
              <div>
                {MOCK_ACTIVITY.map(item => <ActivityItem key={item.id} item={item} />)}
              </div>
            </div>
          </div>

          {/* Right: AI + Leaderboard */}
          <div className="lg:col-span-4 space-y-4">
            {/* Featured AI */}
            <div className="rounded-2xl bg-gradient-to-br from-[#3E276D] to-[#2a1a50] border border-[#8955F3]/30 p-5">
              <h3 className="text-sm font-bold text-white mb-1">Featured AI Interaction</h3>
              <p className="text-xs text-white/40 mb-3">Chat with AI to find your next skill.</p>
              <Link to="/chat" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8955F3] hover:text-[#a47cf5] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Chat your Learning →
              </Link>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 overflow-hidden">
              <div className="px-5 pt-4 pb-2">
                <h3 className="text-sm font-bold text-white">Leaderboard</h3>
                <p className="text-[10px] text-white/30">Top {Math.min(leaderboard.length, 3)} Learners</p>
              </div>
              {lbLoading ? (
                <div className="p-4 space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full opacity-20" />)}</div>
              ) : (
                <>
                  <LeaderboardPodium entries={leaderboard} />
                  <LeaderboardList entries={leaderboard} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Curated for You */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Curated for You</h2>
            <Link to="/explore" className="text-sm text-[#8955F3] hover:text-[#a47cf5] flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {recsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl opacity-20" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {roadmaps.map(r => <RoadmapCard key={r._id} roadmap={r} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { generatedRoadmap, assessmentAnswers, isGuest } = useGuestStore();

  const showGuestDashboard = !user && isGuest && generatedRoadmap;

  if (showGuestDashboard) {
    return <GuestDashboard assessmentAnswers={assessmentAnswers} generatedRoadmap={generatedRoadmap} />;
  }
  return <AuthDashboard user={user || { username: 'guest', full_name: 'Guest', avatar: '' }} assessmentAnswers={assessmentAnswers} />;
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { miscService } from '../../services/miscService';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../hooks/useAuth';
import { useGuestStore } from '../../store/guestStore';
import {
  BookOpen, Activity, Star, Info, TrendingUp, Trophy,
  Medal, Sparkles, ArrowRight, Users, ChevronRight, Zap,
  CheckCircle, Award, Flame, MessageSquare, Play, Clock,
  Layers
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';

// ── Color theme ───────────────────────────────────────────────
// Primary dark  : #3E276D
// Accent purple : #8955F3
// White         : #FFFFFF
// Near-black    : #1F1F1F

// ── Category icon map ─────────────────────────────────────────
const CATEGORY_ICONS = {
  'Foundation Skills':     '💻',
  'Graphic Design Skills': '🎨',
  'Web':                   '🌐',
  'Video Editing':         '🎬',
  'Marketing':             '📢',
  'Content Creation':      '✍️',
  'AI Skills':             '🤖',
  'Data Analyst Skills':   '📊',
  'Cybersecurity':         '🔐',
  'Freelancing & Career':  '💼',
};

// ── Unsplash images for roadmap cards ─────────────────────────
const CARD_IMAGES = {
  'web':              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&q=80',
  'html':             'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=250&fit=crop&q=80',
  'css':              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&q=80',
  'javascript':       'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop&q=80',
  'node':             'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&q=80',
  'laravel':          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&q=80',
  'php':              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&q=80',
  'database':         'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop&q=80',
  'python':           'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&q=80',
  'photoshop':        'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250&fit=crop&q=80',
  'design':           'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=250&fit=crop&q=80',
  'video':            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
  'capcut':           'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
  'premiere':         'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
  'davinci':          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop&q=80',
  'excel':            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80',
  'word':             'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&q=80',
  'powerpoint':       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&q=80',
  'google':           'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=250&fit=crop&q=80',
  'computer':         'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop&q=80',
  'internet':         'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&q=80',
  'marketing':        'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&h=250&fit=crop&q=80',
  'ai':               'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&q=80',
  'data':             'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80',
  'security':         'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=250&fit=crop&q=80',
  'freelanc':         'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&q=80',
  'hosting':          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&q=80',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop&q=80',
];

function getCategoryImage(item) {
  const haystack = [
    item.title || item.name || '',
    item.category_id?.name || '',
    item.description || '',
  ].join(' ').toLowerCase();

  for (const [key, img] of Object.entries(CARD_IMAGES)) {
    if (haystack.includes(key)) return img;
  }
  const hash = [...(item.title || item.name || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

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

// ── Roadmap Card (from trending/recommendations) ───────────────
function RoadmapCard({ roadmap }) {
  const diff = DIFF_LABELS[roadmap.difficulty] || DIFF_LABELS.beginner;
  const href = `/roadmaps/${roadmap._id}`;
  const hasThumbnail = !!roadmap.thumbnail;
  const imgSrc = roadmap.thumbnail || getCategoryImage(roadmap);

  const lessonCount = roadmap.lesson_count || roadmap.modules?.reduce((n, m) => n + (m.lesson_count || 0), 0) || 0;

  if (hasThumbnail) {
    return (
      <Link to={href} className="lp-course-card group block relative w-full overflow-hidden rounded-[20px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(113,48,225,0.24)]">
        {/* The PNG Card in its original ratio */}
        <img src={imgSrc} alt={roadmap.title} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100727]/90 via-[#100727]/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
          {/* Top-left: Difficulty Level */}
          <div>
            <span className="lp-level">
              {diff.label}
            </span>
          </div>

          {/* Bottom Data */}
          <div className="mt-auto">
            <h4 className="font-bold text-white text-[16px] leading-tight line-clamp-2 mb-1 drop-shadow-md">{roadmap.title}</h4>
            <p className="text-[12px] text-white/80 line-clamp-1 mb-3 drop-shadow-md">{roadmap.category_id?.name || diff.label}</p>
            <div className="flex items-center justify-between text-[11px] text-white/90 border-t border-white/20 pt-3">
              <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-[#a974ff]" fill="currentColor" /> {lessonCount} Lessons</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#a974ff]" /> Certified</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className="lp-course-card group block">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#3E276D] to-[#100727] flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-4xl mb-2 block">{roadmap.category_id?.icon || '🗺️'}</span>
          <h4 className="font-bold text-white text-[16px] leading-tight line-clamp-2">{roadmap.title}</h4>
        </div>
        <span className="lp-level absolute top-3 left-3">
          {diff.label}
        </span>
      </div>
      <div className="p-4 pt-3 bg-[#100727]">
        <h4 className="font-bold text-white text-[15px] leading-tight line-clamp-1">{roadmap.title}</h4>
        <p className="text-[12px] text-[#a974ff] line-clamp-1 mt-0.5 mb-3">{roadmap.category_id?.name || diff.label}</p>
        <div className="flex items-center gap-3 text-[11px] text-white/65 border-t border-white/10 pt-3 mb-3">
          <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-[#9d55ff]" /> {lessonCount} Lessons</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#9d55ff]" /> Certified</span>
        </div>
        <div className="lp-cta"><span>View Now</span><ArrowRight className="w-4 h-4" /></div>
      </div>
    </Link>
  );
}

// ── Skill Card (from categories-with-roadmaps) ─────────────────
function SkillCard({ skill }) {
  const hasThumbnail = !!skill.roadmap?.thumbnail;
  const imgSrc = skill.roadmap?.thumbnail || getCategoryImage({ name: skill.name });
  const hasRoadmap = !!skill.roadmap;
  const totalLessons = skill.roadmap?.modules?.reduce((acc, m) => acc + (m.lesson_count || 0), 0) || 0;
  const href = hasRoadmap ? `/roadmaps/${skill.roadmap._id}` : '#';

  if (hasThumbnail) {
    return (
      <Link to={href} className="lp-course-card group block relative w-full overflow-hidden rounded-[20px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(113,48,225,0.24)]">
        {/* The PNG Card in its original ratio */}
        <img src={imgSrc} alt={skill.name} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100727]/90 via-[#100727]/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
          {/* Top-left status badge */}
          <div>
            <span className="lp-level">
              {hasRoadmap ? 'BEGINNER' : 'SOON'}
            </span>
          </div>

          {/* Bottom Data overlays */}
          <div className="mt-auto">
            <h4 className="font-bold text-white text-[16px] leading-tight line-clamp-2 mb-1 drop-shadow-md">{skill.name}</h4>
            <p className="text-[12px] text-white/80 line-clamp-1 mb-3 drop-shadow-md">{hasRoadmap ? 'Start Learning' : 'Coming Soon'}</p>
            <div className="flex items-center justify-between text-[11px] text-white/90 border-t border-white/20 pt-3">
              <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-[#a974ff]" fill="currentColor" /> {totalLessons || '—'} Lessons</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#a974ff]" /> Certified</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className="lp-course-card group block">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#3E276D] to-[#100727] flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🗺️</span>
          <h4 className="font-bold text-white text-[16px] leading-tight line-clamp-2">{skill.name}</h4>
        </div>
        <span className="lp-level absolute top-3 left-3">{hasRoadmap ? 'BEGINNER' : 'SOON'}</span>
      </div>
      <div className="p-4 pt-3 bg-[#100727]">
        <h4 className="font-bold text-white text-[15px] leading-tight line-clamp-1">{skill.name}</h4>
        <p className="text-[12px] text-[#a974ff] line-clamp-1 mt-0.5 mb-3">{hasRoadmap ? 'Start Learning' : 'Coming Soon'}</p>
        <div className="flex items-center gap-3 text-[11px] text-white/65 border-t border-white/10 pt-3 mb-3">
          <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-[#9d55ff]" /> {totalLessons || '—'} Lessons</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-[#9d55ff]" /> Certified</span>
        </div>
        <div className="lp-cta"><span>{hasRoadmap ? 'View Now' : 'Coming Soon'}</span><ArrowRight className="w-4 h-4" /></div>
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

  const ordered = [top3[1], top3[0], top3[2]];
  const heights = ['h-16', 'h-24', 'h-12'];
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
function useDiscoveryData() {
  const { data: trendingResponse, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-roadmaps'],
    queryFn: () => miscService.getTrendingRoadmaps(6),
    staleTime: 5 * 60 * 1000,
  });
  const { data: leaderboardResponse, isLoading: lbLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => miscService.getLeaderboard(10),
    staleTime: 5 * 60 * 1000,
  });
  const { data: categoriesResponse, isLoading: catsLoading } = useQuery({
    queryKey: ['categories-with-roadmaps'],
    queryFn: () => roadmapService.getCategoriesWithRoadmaps(),
    staleTime: 10 * 60 * 1000,
  });

  const trending    = trendingResponse?.data?.data || [];
  const leaderboard = leaderboardResponse?.data?.data || [];
  const categories  = categoriesResponse?.data?.data || [];

  return {
    trending,
    leaderboard,
    categories,
    trendingLoading,
    lbLoading,
    catsLoading,
  };
}

// ── Categories + Skills Section ──────────────────────────────
function CategoriesSection({ categories, catsLoading }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const displayCats = categories.slice(0, 10);
  const initialCategory = categories.find(c => c.name === 'Graphic Design Skills') || categories[0];
  const activeCat = activeCategory
    ? categories.find(c => c._id === activeCategory)
    : initialCategory;

  const skills = activeCat?.skills || [];

  if (catsLoading) {
    return (
      <div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-xl opacity-20 shrink-0" />)}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl opacity-20" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
        {displayCats.map(cat => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                (activeCategory ? activeCategory === cat._id : initialCategory?._id === cat._id)
                ? 'bg-gradient-to-r from-[#7a32f2] to-[#9b4dff] text-white shadow-[0_0_16px_rgba(137,85,243,.35)]'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{CATEGORY_ICONS[cat.name] || '📌'}</span>
            {cat.name}
          </button>
        ))}
      </div>
      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => <SkillCard key={skill._id} skill={skill} />)}
      </div>
    </div>
  );
}

// ── Guest Dashboard ───────────────────────────────────────────
function GuestDashboard({ assessmentAnswers, generatedRoadmap }) {
  const { trending, leaderboard, categories, trendingLoading, lbLoading, catsLoading } = useDiscoveryData();

  return (
    <div className="min-h-screen bg-[#090516]">
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
        {generatedRoadmap && (
          <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 bg-[#8955F3]/15 border border-[#8955F3]/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#8955F3]" />
              <span className="text-xs font-medium text-[#8955F3]">AI-Generated Roadmap Ready</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{generatedRoadmap?.title}</h1>
            <p className="text-white/50 text-sm mb-5 max-w-2xl">{generatedRoadmap?.description}</p>
            <div className="flex gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 bg-[#8955F3] hover:bg-[#7340e0] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
                <Zap className="w-4 h-4" /> Create Free Account
              </Link>
              <Link to="/explore" className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white text-sm px-5 py-2.5 rounded-xl transition-all">
                Browse All
              </Link>
            </div>
          </div>
        )}

        {/* Browse Skills by Category */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8955F3]" />
              <h2 className="text-lg font-bold text-white">Browse Skills</h2>
            </div>
            <Link to="/explore" className="text-sm text-[#8955F3] hover:text-[#a47cf5] flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <CategoriesSection categories={categories} catsLoading={catsLoading} />
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
            {(trendingLoading ? [...Array(6)] : trending.slice(0, 6)).map((r, i) =>
              trendingLoading ? <Skeleton key={i} className="h-56 rounded-2xl opacity-20" /> : <RoadmapCard key={r._id} roadmap={r} />
            )}
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Leaderboard</h2>
              <span className="text-xs text-white/30">Top Learners</span>
            </div>
            <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 overflow-hidden">
              <LeaderboardPodium entries={leaderboard} />
              <LeaderboardList entries={leaderboard} />
              <div className="px-4 py-3 border-t border-white/5">
                <Link to="/register" className="text-xs text-[#8955F3] hover:text-[#a47cf5] font-medium flex items-center gap-1">
                  Join and climb the leaderboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Auth Dashboard ─────────────────────────────────────────────
function AuthDashboard({ user }) {
  const { trending, leaderboard, categories, trendingLoading, lbLoading, catsLoading } = useDiscoveryData();

  return (
    <div className="min-h-screen bg-[#090516]">
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
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#8955F3] rounded-full w-[65%]" />
                </div>
                <button className="w-full text-left text-xs font-medium text-[#8955F3] bg-[#8955F3]/15 border border-[#8955F3]/30 rounded-lg px-3 py-2 hover:bg-[#8955F3]/25 transition-colors flex items-center gap-2">
                  <Play className="w-3 h-3" /> Continue Learning →
                </button>
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
            <div className="rounded-2xl bg-gradient-to-br from-[#3E276D] to-[#2a1a50] border border-[#8955F3]/30 p-5">
              <h3 className="text-sm font-bold text-white mb-1">Featured AI Interaction</h3>
              <p className="text-xs text-white/40 mb-3">Chat with AI to find your next skill.</p>
              <Link to="/chat" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8955F3] hover:text-[#a47cf5] transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Chat your Learning →
              </Link>
            </div>
            <div className="rounded-2xl bg-[#2a2a2e] border border-white/5 overflow-hidden">
              <div className="px-5 pt-4 pb-2">
                <h3 className="text-sm font-bold text-white">Leaderboard</h3>
                <p className="text-[10px] text-white/30">Top Learners</p>
              </div>
              {lbLoading ? (
                <div className="p-4 space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full opacity-20" />)}</div>
              ) : leaderboard.length >= 3 ? (
                <>
                  <LeaderboardPodium entries={leaderboard} />
                  <LeaderboardList entries={leaderboard} />
                </>
              ) : (
                <p className="text-xs text-white/30 px-5 pb-4">No entries yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>

        {/* Browse Skills by Category */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8955F3]" />
              <h2 className="text-lg font-bold text-white">Browse Skills</h2>
            </div>
            <Link to="/explore" className="text-sm text-[#8955F3] hover:text-[#a47cf5] flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <CategoriesSection categories={categories} catsLoading={catsLoading} />
        </div>

        {/* Trending Roadmaps */}
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
            {(trendingLoading ? [...Array(6)] : trending.slice(0, 6)).map((r, i) =>
              trendingLoading ? <Skeleton key={i} className="h-56 rounded-2xl opacity-20" /> : <RoadmapCard key={r._id} roadmap={r} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { savedAiRoadmaps, generatedRoadmap, assessmentAnswers, isGuest } = useGuestStore();

  const activeRoadmap = (savedAiRoadmaps && savedAiRoadmaps.length > 0) 
    ? savedAiRoadmaps[savedAiRoadmaps.length - 1] 
    : generatedRoadmap;

  const showGuestDashboard = !user && isGuest && activeRoadmap;

  if (showGuestDashboard) {
    return <GuestDashboard assessmentAnswers={assessmentAnswers} generatedRoadmap={activeRoadmap} />;
  }
  return <AuthDashboard user={user || { username: 'guest', full_name: 'Guest', avatar: '' }} />;
}

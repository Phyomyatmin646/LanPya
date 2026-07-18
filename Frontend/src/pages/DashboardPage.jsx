import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Map, GraduationCap, TrendingUp, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '@/contexts/authStore';
import { enrollmentService } from '@/services/enrollmentService';
import { roadmapService } from '@/services/roadmapService';
import { miscService } from '@/services/miscService';
import { Skeleton } from '@/components/ui/Skeleton';
import { DifficultyBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDate, truncate } from '@/utils/helpers';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className={`stat-icon ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-dark">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: enrollments, isLoading: loadingEnroll } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments().then(r => r.data.data),
  });

  const { data: roadmapsData, isLoading: loadingRoadmaps } = useQuery({
    queryKey: ['roadmaps', { page: 1, limit: 6 }],
    queryFn: () => roadmapService.getAll({ page: 1, limit: 6 }).then(r => r.data),
  });

  const { data: recs } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => miscService.getRecommendations().then(r => r.data.data),
  });

  const completedCount = (enrollments || []).filter(e => e.status === 'completed').length;
  const inProgressCount = (enrollments || []).filter(e => e.status === 'in_progress').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Good day, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="page-subtitle">Here's your learning overview for today.</p>
        </div>
        <Link to="/roadmaps" className="btn btn-primary btn-md">
          <Map className="w-4 h-4" /> Browse Roadmaps
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}     label="Enrolled"    value={loadingEnroll ? '—' : (enrollments?.length || 0)}
          color="bg-gradient-primary" delay={0} />
        <StatCard icon={TrendingUp}   label="In Progress" value={loadingEnroll ? '—' : inProgressCount}
          color="bg-gradient-secondary" delay={0.05} />
        <StatCard icon={CheckCircle2} label="Completed"   value={loadingEnroll ? '—' : completedCount}
          color="bg-emerald-500" delay={0.1} />
        <StatCard icon={Sparkles}     label="Recommended" value={recs?.length || '—'}
          color="bg-amber-400" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My enrollments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-dark">My Learning</h2>
            <Link to="/my-learning" className="text-sm text-secondary hover:underline">View all</Link>
          </div>

          {loadingEnroll ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
            </div>
          ) : (enrollments || []).length === 0 ? (
            <div className="card p-8 text-center">
              <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">You haven't enrolled in any roadmap yet.</p>
              <Link to="/roadmaps" className="btn btn-primary btn-sm mt-4">Explore Roadmaps</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(enrollments || []).slice(0, 5).map((e) => {
                const r = e.roadmap_id;
                return (
                  <Link key={e._id} to={`/roadmaps/${r?._id || r}`}
                    className="card p-4 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 block">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Map className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-dark truncate">{r?.title || 'Roadmap'}</p>
                      <div className="progress-bar mt-2">
                        <div className="progress-fill" style={{ width: `${e.progress || 0}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-primary">{e.progress || 0}%</p>
                      <StatusBadge status={e.status} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-dark">Recommended</h2>
            <Link to="/recommendations" className="text-sm text-secondary hover:underline">More</Link>
          </div>

          {(recs || []).length === 0 ? (
            <div className="card p-6 text-center">
              <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-500 text-xs">No recommendations yet. Keep learning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(recs || []).slice(0, 4).map((rec) => {
                const rm = rec.roadmap_id;
                return (
                  <Link key={rec._id} to={`/roadmaps/${rm?._id}`}
                    className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 block">
                    <p className="font-semibold text-sm text-dark truncate">{rm?.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rec.reason}</p>
                    <div className="flex items-center justify-between mt-2">
                      <DifficultyBadge difficulty={rm?.difficulty} />
                      <span className="text-xs text-secondary font-medium">{Math.round((rec.confidence || 0) * 100)}% match</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Latest Roadmaps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-dark">Latest Roadmaps</h2>
          <Link to="/roadmaps" className="text-sm text-secondary hover:underline">Browse all</Link>
        </div>

        {loadingRoadmaps ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(roadmapsData?.data || []).map((rm, i) => (
              <motion.div key={rm._id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/roadmaps/${rm._id}`} className="card-hover p-5 block">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center mb-3">
                    <Map className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-dark mb-1 truncate">{rm.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{truncate(rm.description, 80)}</p>
                  <div className="flex items-center justify-between">
                    <DifficultyBadge difficulty={rm.difficulty} />
                    {rm.estimated_duration && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />{rm.estimated_duration}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

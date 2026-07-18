import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Map, Clock, Filter, Play, Award } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { roadmapService } from '@/services/roadmapService';
import { enrollmentService } from '@/services/enrollmentService';
import { CardSkeletons } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/States';
import { DifficultyBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { truncate } from '@/utils/helpers';
import useAuthStore from '@/contexts/authStore';

const DIFFICULTIES = ['', 'beginner', 'intermediate', 'advanced'];

export default function RoadmapsPage() {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState(searchParams.get('search') || '');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['roadmaps', { page, search, difficulty }],
    queryFn: () => roadmapService.getAll({ page, limit: 9, search, difficulty }).then(r => r.data),
    keepPreviousData: true,
  });

  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments().then(r => r.data.data),
    enabled: isAuthenticated,
  });

  const enrolledIds = new Set((enrollments || []).map(e => {
    const rid = e.roadmap_id;
    return typeof rid === 'object' ? rid?._id : rid;
  }));

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const roadmaps   = data?.data  || [];
  const meta       = data?.meta  || {};
  const totalPages = Math.ceil((meta.total || 0) / 9);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roadmaps</h1>
          <p className="page-subtitle">Explore curated learning paths built by experts.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={handleSearch} placeholder="Search roadmaps…" className="flex-1" />
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select className="input !w-auto" value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}>
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <CardSkeletons count={9} />
      ) : roadmaps.length === 0 ? (
        <EmptyState icon={Map} title="No roadmaps found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roadmaps.map((rm, i) => {
              const enrolled = enrolledIds.has(rm._id);
              const hasThumbnail = !!rm.thumbnail;
              const lessonCount = rm.lesson_count || rm.modules?.reduce((n, m) => n + (m.lesson_count || 0), 0) || 0;

              return (
                <motion.div key={rm._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  {hasThumbnail ? (
                    <Link to={`/roadmaps/${rm._id}`} className="lp-course-card group block relative aspect-square overflow-hidden border border-[#3c2c6d] rounded-[20px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(113,48,225,0.24)]">
                      {/* The PNG Card */}
                      <img src={rm.thumbnail} alt={rm.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Top status badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <DifficultyBadge difficulty={rm.difficulty} />
                        {enrolled && (
                          <span className="badge badge-success text-[10px] font-bold px-2 py-0.5">Enrolled</span>
                        )}
                      </div>

                      {/* Bottom Bar: Lesson Count & Certification */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/75 text-white border border-white/10 backdrop-blur-sm">
                          <Play className="w-3 h-3 text-[#a974ff]" fill="currentColor" /> {lessonCount} Lessons
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/75 text-white border border-white/10 backdrop-blur-sm">
                          <Award className="w-3 h-3 text-[#a974ff]" /> Certified
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link to={`/roadmaps/${rm._id}`} className="card-hover p-0 block overflow-hidden">
                      {/* Thumbnail */}
                      <div className="aspect-square w-full relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg,#3E276D 0%,#8955F3 100%)' }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <Map className="w-16 h-16 text-white/30" />
                        </div>
                        {enrolled && (
                          <span className="absolute top-3 right-3 badge badge-success text-[11px]">Enrolled</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-display font-semibold text-dark mb-1 truncate">{rm.title}</h3>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{truncate(rm.description, 90)}</p>
                        <div className="flex items-center justify-between">
                          <DifficultyBadge difficulty={rm.difficulty} />
                          {rm.estimated_duration && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />{rm.estimated_duration}
                            </span>
                          )}
                        </div>
                        {rm.created_by && (
                          <p className="text-xs text-gray-400 mt-3">by {rm.created_by?.full_name || 'Unknown'}</p>
                        )}
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

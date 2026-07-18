import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { miscService } from '@/services/miscService';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/States';
import { DifficultyBadge } from '@/components/ui/Badge';

export default function RecommendationsPage() {
  const { data: recs = [], isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => miscService.getRecommendations().then(r => r.data.data),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Recommendations</h1>
          <p className="page-subtitle">Personalized roadmaps picked by AI for you.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : recs.length === 0 ? (
        <EmptyState icon={Sparkles} title="No recommendations yet"
          description="Keep learning to get AI-powered recommendations!" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recs.map((rec, i) => {
            const rm = rec.roadmap_id;
            return (
              <motion.div key={rec._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/roadmaps/${rm?._id}`} className="card-hover p-5 block">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Map className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-secondary">
                      {Math.round((rec.confidence || 0) * 100)}% match
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-dark mb-2">{rm?.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{rec.reason}</p>
                  <DifficultyBadge difficulty={rm?.difficulty} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

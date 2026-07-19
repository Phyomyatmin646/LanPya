import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollmentService';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/States';
import { useGuestStore } from '../../store/guestStore';

export default function MyLearningPage() {
  const { data: progressResponse, isLoading } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => enrollmentService.getMyEnrollments(),
  });

  const enrolledRoadmaps = progressResponse?.data?.data || [];

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D0D7DE]">
        <h1 className="text-2xl font-semibold text-[#24292F]">My Learning</h1>
        <Link to="/assessment" className="btn btn-primary text-sm">
          Get New AI Path
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : enrolledRoadmaps.length === 0 ? (
        <EmptyState 
          icon={Activity}
          title="No roadmaps yet"
          description="Start exploring and enroll in your first roadmap to track your progress here."
          action={
            <Link to="/explore" className="btn btn-primary">Browse Roadmaps</Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrolledRoadmaps.map(prog => (
            <div key={prog._id} className="gh-box flex flex-col h-full hover:border-[#8C959F] transition-colors group">
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-[#57606A]" />
                  <h3 className="font-semibold text-lg text-[#0969DA] group-hover:underline line-clamp-1">
                    {prog.roadmap_id?.title}
                  </h3>
                </div>
                <p className="text-sm text-[#57606A] mb-4 line-clamp-2">
                  {prog.roadmap_id?.description}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs text-[#57606A] mb-1">
                    <span>Progress</span>
                    <span className="font-medium text-[#24292F]">{Math.round(prog.progress_percentage || 0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prog.progress_percentage === 100 ? 'bg-[#2DA44E]' : 'bg-accent'}`}
                      style={{ width: `${prog.progress_percentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-[#F6F8FA] px-4 py-3 border-t border-[#D0D7DE] flex items-center justify-between">
                {prog.roadmap_id?.is_public === false ? (
                  <span className="text-xs text-[#8955F3] font-semibold">Custom AI Path</span>
                ) : prog.progress_percentage === 100 ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-[#1A7F37]">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <span className="text-xs text-[#57606A]">Keep going!</span>
                )}
                <Link to={`/roadmaps/${prog.roadmap_id?._id}`} className="btn btn-default text-xs py-1 h-7">
                  {prog.roadmap_id?.is_public === false ? 'View' : 'Continue'} <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

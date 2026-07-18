import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../hooks/useAuth';
import { useGuestStore } from '../../store/guestStore';
import { BookOpen, Activity, Star, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/States';
import { Avatar } from '../../components/ui/Avatar';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { generatedRoadmap, isGuest } = useGuestStore();

  const { data: recommendedResponse, isLoading: isLoadingRecs } = useQuery({
    queryKey: ['roadmaps', 'recommended'],
    queryFn: () => roadmapService.getAll({ limit: 5 }),
  });

  return (
    <div className="container-gh py-8">
      
      {!user && isGuest && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-accent">You are exploring as a Guest</h3>
              <p className="text-sm text-[#57606A]">Create a free account to save your progress, unlock AI chat, and earn certificates.</p>
            </div>
          </div>
          <Link to="/register" className="btn btn-primary whitespace-nowrap">Create Free Account</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left/Main Column */}
        <div className="md:col-span-8">
          
          {!user && isGuest && generatedRoadmap ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#24292F] mb-4 border-b border-[#D0D7DE] pb-2">Your AI Generated Roadmap</h2>
              <div className="gh-box p-6">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-lg text-[#0969DA]">{generatedRoadmap.title}</h3>
                </div>
                <p className="text-[#57606A] mb-4">{generatedRoadmap.description}</p>
                <div className="space-y-2 border-t border-[#D0D7DE] pt-4">
                  <h4 className="text-xs font-semibold text-[#24292F] uppercase tracking-wider">Preview Curriculum</h4>
                  {generatedRoadmap.modules?.slice(0, 3).map((m, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="text-[#57606A] w-4">{idx + 1}.</span>
                      <span className="font-medium text-[#24292F]">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 border-b border-[#D0D7DE] pb-2">
                <h2 className="text-xl font-semibold text-[#24292F]">Recent Activity</h2>
                <Link to="/explore" className="text-accent text-sm hover:underline">Explore Roadmaps</Link>
              </div>
              
              <div className="gh-box p-6 mb-6">
                <EmptyState 
                  icon={Activity}
                  title="No recent activity"
                  description="When you enroll in roadmaps or complete lessons, your activity will show up here."
                  action={
                    <Link to="/explore" className="btn btn-primary">Find a Roadmap</Link>
                  }
                />
              </div>

              <div className="flex items-center justify-between mb-4 border-b border-[#D0D7DE] pb-2">
                <h2 className="text-xl font-semibold text-[#24292F]">Continue Learning</h2>
              </div>
              
              <div className="space-y-4">
                <div className="gh-box p-6 flex flex-col items-center justify-center text-center text-[#57606A]">
                  <BookOpen className="w-8 h-8 mb-3 text-[#D0D7DE]" />
                  <p>You aren't enrolled in any roadmaps yet.</p>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Right Column */}
        <div className="md:col-span-4 space-y-6">
          
          <div className="gh-box p-4 flex items-center gap-3">
            <Avatar fallback={user ? user.username : 'Guest'} size="lg" />
            <div>
              <h3 className="font-semibold text-[#24292F]">{user ? user.full_name : 'Guest User'}</h3>
              <p className="text-sm text-[#57606A]">@{user ? user.username : 'guest'}</p>
            </div>
          </div>

          <div className="gh-box">
            <div className="gh-box-header">
              Explore repositories
            </div>
            <div className="p-0">
              {isLoadingRecs ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <ul className="divide-y divide-[#D0D7DE]">
                  {recommendedResponse?.data?.data?.map(roadmap => (
                    <li key={roadmap._id} className="p-4 hover:bg-[#F6F8FA] transition-colors">
                      <Link to={`/roadmaps/${roadmap._id}`} className="block">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-[#57606A]" />
                          <h4 className="font-semibold text-accent hover:underline text-sm">{roadmap.title}</h4>
                        </div>
                        <p className="text-xs text-[#57606A] line-clamp-2 mb-2">{roadmap.description}</p>
                        <div className="flex items-center gap-3 text-xs text-[#57606A]">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#E3B341]"></span> {roadmap.category?.name || 'Category'}
                          </span>
                          <span>★ {roadmap.ratings?.average || 0}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-3 border-t border-[#D0D7DE]">
                <button 
                  onClick={() => navigate('/explore')}
                  className="text-xs text-accent hover:underline w-full text-left font-medium"
                >
                  Explore more →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

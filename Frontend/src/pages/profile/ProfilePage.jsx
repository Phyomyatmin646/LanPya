import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { progressService } from '../../services/progressService';
import { Avatar } from '../../components/ui/Avatar';
import { Users, MapPin, Link as LinkIcon, BookOpen, Star, Activity } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const { data: progressResponse, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressService.getMyProgress(),
  });

  const enrolledRoadmaps = progressResponse?.data?.data || [];

  // Generate a mock heatmap grid (52 weeks x 7 days)
  const heatmapWeeks = Array.from({ length: 52 });
  const heatmapDays = Array.from({ length: 7 });

  return (
    <div className="container-gh py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="w-full md:w-1/4 shrink-0">
          <Avatar fallback={user?.username} className="w-full h-auto aspect-square rounded-full border border-[#D0D7DE] mb-4" />
          
          <h1 className="text-2xl font-bold text-[#24292F] leading-tight">{user?.full_name}</h1>
          <p className="text-xl text-[#57606A] font-light mb-4">{user?.username}</p>
          
          <button className="btn btn-default w-full mb-4">Edit profile</button>
          
          <div className="flex items-center gap-1 text-sm text-[#24292F] mb-4 hover:text-accent cursor-pointer">
            <Users className="w-4 h-4 text-[#57606A]" />
            <span className="font-semibold">0</span> <span className="text-[#57606A]">followers</span> ·
            <span className="font-semibold ml-1">0</span> <span className="text-[#57606A]">following</span>
          </div>

          <div className="space-y-2 text-sm text-[#24292F]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#57606A]" />
              Earth
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-[#57606A]" />
              <a href="#" className="text-[#0969DA] hover:underline">github.com/{user?.username}</a>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-1 space-y-8">
          
          {/* Pinned / Active Learning */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-normal text-[#24292F]">Pinned</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : enrolledRoadmaps.length === 0 ? (
              <div className="gh-box p-8 text-center text-[#57606A]">
                You don't have any pinned roadmaps. Enroll in a roadmap to see it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enrolledRoadmaps.slice(0, 4).map(prog => (
                  <div key={prog._id} className="gh-box p-4 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-[#57606A]" />
                      <Link to={`/roadmaps/${prog.roadmap._id}`} className="font-semibold text-[#0969DA] hover:underline truncate">
                        {prog.roadmap.title}
                      </Link>
                    </div>
                    <p className="text-xs text-[#57606A] mb-4 flex-1 line-clamp-2">
                      {prog.roadmap.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#57606A]">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        {Math.round(prog.progress_percentage || 0)}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {prog.roadmap.ratings?.average || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contribution Activity Heatmap */}
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-sm font-normal text-[#24292F]">124 contributions in the last year</h2>
            </div>
            <div className="gh-box p-4">
              <div className="flex gap-[3px] overflow-hidden">
                {heatmapWeeks.map((_, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {heatmapDays.map((_, j) => {
                      // Randomize intensity for the mockup
                      const intensity = Math.random();
                      let bgClass = "bg-[#EBEDF0]"; // 0
                      if (intensity > 0.9) bgClass = "bg-[#216E39]"; // 4
                      else if (intensity > 0.7) bgClass = "bg-[#30A14E]"; // 3
                      else if (intensity > 0.5) bgClass = "bg-[#40C463]"; // 2
                      else if (intensity > 0.3) bgClass = "bg-[#9BE9A8]"; // 1
                      
                      return (
                        <div 
                          key={`${i}-${j}`} 
                          className={`w-[10px] h-[10px] rounded-sm ${bgClass}`}
                          title="Mock contribution"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-[#57606A]">
                <a href="#" className="hover:text-[#0969DA]">Learn how we count contributions</a>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div className="w-[10px] h-[10px] rounded-sm bg-[#EBEDF0]" />
                  <div className="w-[10px] h-[10px] rounded-sm bg-[#9BE9A8]" />
                  <div className="w-[10px] h-[10px] rounded-sm bg-[#40C463]" />
                  <div className="w-[10px] h-[10px] rounded-sm bg-[#30A14E]" />
                  <div className="w-[10px] h-[10px] rounded-sm bg-[#216E39]" />
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#D0D7DE] pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#57606A]" />
              <h2 className="text-sm font-normal text-[#24292F]">Contribution activity</h2>
            </div>
            <div className="ml-2 pl-4 border-l-2 border-[#D0D7DE] pb-4">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#F6F8FA] border-2 border-[#D0D7DE] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#57606A]"></div>
                </div>
                <h3 className="text-sm font-medium text-[#24292F] mb-1">Created an account</h3>
                <p className="text-xs text-[#57606A]">Joined LanPya learning platform.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

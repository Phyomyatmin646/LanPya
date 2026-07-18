import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { BookOpen, Star, FileText, CheckCircle2, Circle, Users, Info } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: roadmapResponse, isLoading } = useQuery({
    queryKey: ['roadmap', id],
    queryFn: () => roadmapService.getById(id),
  });

  const { data: modulesResponse, isLoading: modulesLoading } = useQuery({
    queryKey: ['roadmap', id, 'modules'],
    queryFn: () => roadmapService.getModules(id),
  });

  const enrollMutation = useMutation({
    mutationFn: () => roadmapService.enroll(id),
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      queryClient.invalidateQueries(['roadmap', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  });

  if (isLoading) {
    return (
      <div className="container-gh py-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const roadmap = roadmapResponse?.data?.data;
  const modules = modulesResponse?.data?.data || [];
  const isEnrolled = roadmap?.isEnrolled;

  return (
    <div className="bg-[#F6F8FA] min-h-screen">
      {/* Repository Header */}
      <div className="bg-white border-b border-[#D0D7DE] pt-6 pb-0">
        <div className="container-gh">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#57606A]" />
              <h1 className="text-xl font-semibold text-[#0969DA] hover:underline cursor-pointer">
                {roadmap.title}
              </h1>
              <Badge variant="default" className="ml-2">Public</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn btn-default text-xs py-1 px-2 h-7 gap-1">
                <Star className="w-4 h-4" /> Star
                <span className="bg-[#F3F4F6] px-1.5 py-0.5 rounded-full ml-1 text-xs border border-[#D0D7DE]">
                  {roadmap.ratings?.average || 0}
                </span>
              </button>
              
              {!isEnrolled ? (
                <button 
                  onClick={() => {
                    if (!user) {
                      toast((t) => (
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold text-sm">Create a free account to enroll</span>
                          <Link to="/register" onClick={() => toast.dismiss(t.id)} className="bg-accent text-white px-2 py-1 rounded text-xs text-center mt-1 w-full">Sign up now</Link>
                        </div>
                      ), { duration: 4000, icon: '🔒' });
                      return;
                    }
                    enrollMutation.mutate();
                  }}
                  disabled={enrollMutation.isPending}
                  className="btn btn-primary text-xs py-1 px-3 h-7"
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                </button>
              ) : (
                <button className="btn btn-default text-xs py-1 px-3 h-7 text-[#1A7F37] border-[#1A7F37] bg-[#E5F6EB]">
                  Enrolled
                </button>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-4 border-b-0 overflow-x-auto">
            <button className="flex items-center gap-2 py-2 px-1 border-b-2 border-[#FD8C73] font-semibold text-[#24292F] text-sm">
              <FileText className="w-4 h-4" /> Content
            </button>
            <button className="flex items-center gap-2 py-2 px-1 border-b-2 border-transparent font-medium text-[#57606A] hover:text-[#24292F] hover:border-[#D0D7DE] text-sm">
              <Users className="w-4 h-4" /> Discussions
            </button>
            <button className="flex items-center gap-2 py-2 px-1 border-b-2 border-transparent font-medium text-[#57606A] hover:text-[#24292F] hover:border-[#D0D7DE] text-sm">
              <Info className="w-4 h-4" /> Insights
            </button>
          </nav>
        </div>
      </div>

      <div className="container-gh py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Content (File Explorer Style) */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div className="gh-box">
              <div className="gh-box-header flex items-center justify-between">
                <span>Curriculum Modules</span>
                <span className="font-normal text-[#57606A]">{modules.length} modules</span>
              </div>
              <div className="p-0">
                {modulesLoading ? (
                  <div className="p-4"><Skeleton className="h-10 w-full" /></div>
                ) : modules.length === 0 ? (
                  <div className="p-8 text-center text-[#57606A]">No modules published yet.</div>
                ) : (
                  <ul className="divide-y divide-[#D0D7DE]">
                    {modules.map(module => (
                      <li key={module._id} className="hover:bg-[#F6F8FA] transition-colors">
                        <div className="p-4 flex items-start gap-3">
                          <div className="mt-1">
                            {isEnrolled && module.is_completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#1A7F37]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#D0D7DE]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#24292F] text-sm">
                              {module.title}
                            </h3>
                            <p className="text-[#57606A] text-sm mt-1">{module.description}</p>
                            
                            {/* Lessons List - if we have them in the response */}
                            {module.lessons && module.lessons.length > 0 && (
                              <div className="mt-3 bg-white border border-[#D0D7DE] rounded-md overflow-hidden">
                                {module.lessons.map((lesson, idx) => (
                                  <Link 
                                    key={lesson._id}
                                    to={isEnrolled ? `/roadmaps/${id}/learn/${lesson._id}` : '#'}
                                    className={`flex items-center gap-2 p-2 text-sm ${idx !== module.lessons.length - 1 ? 'border-b border-[#D0D7DE]' : ''} hover:bg-[#F3F4F6] transition-colors ${!isEnrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={(e) => {
                                      if (!isEnrolled) {
                                        e.preventDefault();
                                        toast('Please enroll to view lessons', { icon: 'ℹ️' });
                                      }
                                    }}
                                  >
                                    <FileText className="w-4 h-4 text-[#57606A]" />
                                    <span className="text-[#0969DA] hover:underline">{lesson.title}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* README equivalent */}
            <div className="gh-box">
              <div className="gh-box-header flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> README.md
              </div>
              <div className="gh-box-body prose prose-sm max-w-none text-[#24292F]">
                <h2>About this Roadmap</h2>
                <p>{roadmap.description}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar (About) */}
          <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#24292F] mb-3">About</h3>
              <p className="text-sm text-[#57606A] mb-4">{roadmap.description}</p>
              
              <div className="space-y-2 text-sm text-[#57606A]">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <strong>{roadmap.ratings?.average || 0}</strong> stars
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <strong>{roadmap.enrollment_count || 0}</strong> enrolled
                </div>
              </div>
            </div>
            
            <div className="border-t border-[#D0D7DE] pt-4">
              <h3 className="text-sm font-semibold text-[#24292F] mb-3">Category</h3>
              <Badge variant="primary">{roadmap.category?.name || 'Uncategorized'}</Badge>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

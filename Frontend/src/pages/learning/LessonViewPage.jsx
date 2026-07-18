import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { progressService } from '../../services/enrollmentService';
import { FileText, CheckCircle, Circle, ChevronLeft, MessageSquare, PlayCircle, FileDown, Lock } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import ChatComponent from '../chat/ChatComponent';
import { useAuth } from '../../hooks/useAuth';

export default function LessonViewPage() {
  const { id, lessonId } = useParams();
  const queryClient = useQueryClient();
  const [showAi, setShowAi] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch roadmap modules to build the sidebar tree
  const { data: modulesResponse, isLoading: modulesLoading } = useQuery({
    queryKey: ['roadmap', id, 'modules'],
    queryFn: () => roadmapService.getModules(id),
  });

  // Fetch specific lesson content
  const { data: lessonResponse, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => roadmapService.getLesson(lessonId),
  });

  // Fetch lesson resources
  const { data: resourcesResponse } = useQuery({
    queryKey: ['lesson', lessonId, 'resources'],
    queryFn: () => roadmapService.getLessonResources(lessonId),
  });

  const markCompleteMutation = useMutation({
    mutationFn: () => progressService.markLessonCompleted(lessonId),
    onSuccess: () => {
      toast.success('Lesson marked as complete!');
      queryClient.invalidateQueries(['roadmap', id, 'modules']);
    },
    onError: () => toast.error('Failed to mark complete'),
  });

  const handleRestrictedAction = (actionName) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-sm">Create a free account to {actionName}</span>
        <button 
          onClick={() => { toast.dismiss(t.id); navigate('/register'); }}
          className="bg-accent text-white px-2 py-1 rounded text-xs w-full mt-1"
        >
          Sign up now
        </button>
      </div>
    ), { duration: 4000, icon: '🔒' });
  };

  const modules = modulesResponse?.data?.data || [];
  const lesson = lessonResponse?.data?.data;
  const resources = resourcesResponse?.data?.data || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      
      {/* Left Sidebar - File Tree */}
      <div className="w-64 border-r border-[#D0D7DE] bg-[#F6F8FA] overflow-y-auto hidden md:block shrink-0">
        <div className="p-4 border-b border-[#D0D7DE]">
          <Link to={`/roadmaps/${id}`} className="flex items-center gap-1 text-sm text-[#57606A] hover:text-[#0969DA] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Repo
          </Link>
        </div>
        <div className="p-2">
          {modulesLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map(module => (
                <div key={module._id}>
                  <div className="px-2 py-1 flex items-center gap-2 text-sm font-semibold text-[#24292F]">
                    {module.title}
                  </div>
                  {module.lessons?.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {module.lessons.map(l => {
                        const isActive = l._id === lessonId;
                        return (
                          <li key={l._id}>
                            <Link 
                              to={`/roadmaps/${id}/learn/${l._id}`}
                              className={`flex items-start gap-2 px-2 py-1.5 rounded-md text-sm transition-colors
                                ${isActive ? 'bg-[#D0D7DE]/50 text-[#24292F] font-medium' : 'text-[#57606A] hover:bg-[#D0D7DE]/30 hover:text-[#24292F]'}
                              `}
                            >
                              <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-[#0969DA]' : 'text-[#8C959F]'}`} />
                              <span className="leading-snug">{l.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-y-auto bg-white transition-all ${showAi ? 'mr-80 md:mr-[400px]' : ''}`}>
        {lessonLoading ? (
          <div className="max-w-3xl mx-auto p-8 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !lesson ? (
          <div className="p-8 text-center text-[#57606A]">Lesson not found.</div>
        ) : (
          <div className="max-w-3xl mx-auto p-6 lg:p-10 relative">
            
            {!user && (
              <div className="absolute top-0 inset-x-0 bg-accent/10 border-b border-accent/20 px-6 py-2 text-sm text-[#24292F] flex justify-between items-center">
                <span>You are previewing this lesson as a Guest.</span>
                <Link to="/register" className="text-accent font-medium hover:underline">Create Account</Link>
              </div>
            )}

            {/* Header */}
            <div className={`flex flex-wrap items-start justify-between gap-4 mb-8 pb-6 border-b border-[#D0D7DE] ${!user ? 'mt-8' : ''}`}>
              <div>
                <h1 className="text-3xl font-semibold text-[#24292F] mb-2">{lesson.title}</h1>
                <p className="text-[#57606A]">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => user ? setShowAi(!showAi) : handleRestrictedAction('use AI Copilot')}
                  className="btn btn-default gap-2"
                >
                  {user ? (
                    <><MessageSquare className="w-4 h-4 text-accent" /> {showAi ? 'Close AI' : 'Ask AI'}</>
                  ) : (
                    <><Lock className="w-4 h-4 text-[#8C959F]" /> Ask AI</>
                  )}
                </button>
                <button 
                  onClick={() => user ? markCompleteMutation.mutate() : handleRestrictedAction('save progress')}
                  disabled={user && markCompleteMutation.isPending}
                  className="btn btn-primary gap-2"
                >
                  {user ? (
                    <><CheckCircle className="w-4 h-4" /> {markCompleteMutation.isPending ? 'Saving...' : 'Complete'}</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Complete</>
                  )}
                </button>
              </div>
            </div>

            {/* Markdown Body */}
            <div className="prose prose-sm sm:prose-base max-w-none text-[#24292F] prose-headings:font-semibold prose-a:text-[#0969DA] prose-pre:bg-[#F6F8FA] prose-pre:border prose-pre:border-[#D0D7DE] prose-pre:text-[#24292F]">
              <div dangerouslySetInnerHTML={{ __html: lesson.content || '<p>No text content available.</p>' }} />
            </div>

            {/* Resources Section */}
            {resources.length > 0 && (
              <div className="mt-12 pt-6 border-t border-[#D0D7DE]">
                <h3 className="text-lg font-semibold text-[#24292F] mb-4">Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resources.map(res => (
                    <a 
                      key={res._id} 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gh-box p-3 flex items-center gap-3 hover:border-accent transition-colors group"
                    >
                      <div className="p-2 bg-[#F6F8FA] rounded-md group-hover:bg-accent/10 transition-colors">
                        {res.type === 'video' ? <PlayCircle className="w-5 h-5 text-accent" /> : <FileDown className="w-5 h-5 text-[#0969DA]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#24292F]">{res.title}</h4>
                        <p className="text-xs text-[#57606A] uppercase">{res.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar - AI Copilot */}
      {showAi && user && (
        <div className="fixed right-0 top-16 bottom-0 w-80 md:w-[400px] border-l border-[#D0D7DE] bg-white shadow-2xl z-30 flex flex-col">
          <div className="p-3 border-b border-[#D0D7DE] bg-[#F6F8FA] flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" /> LanPya Copilot
            </h3>
            <button onClick={() => setShowAi(false)} className="text-[#57606A] hover:text-[#24292F]">
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatComponent embedded />
          </div>
        </div>
      )}
    </div>
  );
}

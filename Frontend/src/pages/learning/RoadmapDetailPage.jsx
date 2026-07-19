import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import {
  PlayCircle, CheckCircle2, ChevronLeft, ChevronRight,
  List, Share2, ThumbsUp, Clock, BookOpen, Users,
  Lock, MessageSquare, Check, ChevronDown, ChevronUp,
  Shuffle, RotateCcw, MoreVertical, Play
} from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useGuestStore } from '../../store/guestStore';
import { QuizModal } from '../../components/quiz/QuizModal';

// ── YouTube URL → embed URL ────────────────────────────────────
function getEmbedUrl(url) {
  if (!url) return null;

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (ytMatch) {
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      autoplay: '0',
    });
    return `https://www.youtube.com/embed/${ytMatch[1]}?${params}`;
  }
  return null;
}

function getYoutubeThumbnail(url) {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (ytMatch) return `https://i.ytimg.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  if (url.includes('youtube.com/results')) return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&auto=format&fit=crop&q=60';
  return null;
}

// ── Difficulty badge ──────────────────────────────────────────
const DIFF = {
  beginner:     { label: 'Beginner',     cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  intermediate: { label: 'Intermediate', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  advanced:     { label: 'Advanced',     cls: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [activeLesson, setActiveLesson] = useState(null); // { lesson, resource }
  const [expandedModules, setExpandedModules] = useState({});
  const [activeQuizModule, setActiveQuizModule] = useState(null);
  const [activeLessonQuiz, setActiveLessonQuiz] = useState(null);
  
  // Use our full roadmap endpoint that includes modules + lessons + resources
  const { data: roadmapResponse, isLoading } = useQuery({
    queryKey: ['roadmap-full', id],
    queryFn: () => roadmapService.getFullRoadmap(id),
  });

  const roadmap = roadmapResponse?.data?.data;
  const modules = roadmap?.modules || [];

  // Flatten all lessons for prev/next navigation
  const allLessons = modules.flatMap(mod =>
    (mod.lessons || []).map(lesson => ({
      lesson,
      module: mod,
      resource: lesson.resources?.find(r => r.type === 'video') || null,
    }))
  );

  // Auto-select first lesson with a video
  useEffect(() => {
    if (allLessons.length > 0 && !activeLesson) {
      const first = allLessons.find(l => l.resource) || allLessons[0];
      setActiveLesson(first);
      // Expand first module by default
      if (modules[0]) setExpandedModules({ [modules[0]._id]: true });
    }
  }, [modules.length, allLessons, activeLesson, modules]);

  const activeIndex = activeLesson
    ? allLessons.findIndex(l => l.lesson._id === activeLesson.lesson._id)
    : -1;

  const { data: progressResponse } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => import('../../services/enrollmentService').then(m => m.progressService.getRoadmapProgress(id)),
    enabled: !!user
  });

  // The backend endpoint `/progress/roadmap/:roadmapId` returns `{ lessons: Number, progress: [...] }`
  const enrolledData = progressResponse?.data?.data;
  const progressDocs = enrolledData?.progress || [];
  const completedSet = new Set(
    progressDocs.filter(p => p.completed).map(p => p.lesson_id)
  );
  const isCompleted = activeLesson ? completedSet.has(activeLesson.lesson._id) : false;

  const markCompleteMutation = useMutation({
    mutationFn: (lessonId) => import('../../services/enrollmentService').then(m => m.progressService.markLesson(lessonId)),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['progress', id]);
      
      const currentModule = activeLesson.module;
      const moduleLessonIds = currentModule.lessons.map(l => l._id);
      
      // Popup lesson quiz
      setTimeout(() => setActiveLessonQuiz(activeLesson.lesson), 300);

      // We manually add it here to check completion without waiting for refetch
      const tempCompleted = new Set(completedSet);
      tempCompleted.add(variables);
      const isModuleComplete = moduleLessonIds.every(lid => tempCompleted.has(lid));
      
      if (isModuleComplete) {
        setTimeout(() => setActiveQuizModule(currentModule), 800);
      }
    }
  });

  const handleMarkAsComplete = (lessonId) => {
    markCompleteMutation.mutate(lessonId);
  };

  const goTo = (idx) => {
    if (idx >= 0 && idx < allLessons.length) {
      setActiveLesson(allLessons[idx]);
      // Expand the module this lesson belongs to
      setExpandedModules(prev => ({ ...prev, [allLessons[idx].module._id]: true }));
    }
  };

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const totalLessons = allLessons.length;
  const totalModules = modules.length;
  const diff = DIFF[roadmap?.difficulty] || DIFF.beginner;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="aspect-video w-full rounded-xl bg-white/5" />
            <Skeleton className="h-6 w-2/3 bg-white/5" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg bg-white/5" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <p className="text-white/50">Roadmap not found.</p>
      </div>
    );
  }

  const embedUrl = activeLesson?.resource ? getEmbedUrl(activeLesson.resource.url) : null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-[1600px] mx-auto px-3 py-4">

        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── LEFT: Video Player + Info ─────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Video Player */}
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video w-full shadow-2xl">
              {embedUrl ? (
                <iframe
                  key={activeLesson?.lesson._id}
                  src={embedUrl}
                  title={activeLesson?.lesson?.title || 'Lesson Video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    <Play className="w-10 h-10 text-white/60 ml-1" />
                  </div>
                  <p className="text-white/50 text-sm mb-4">
                    {activeLesson ? 'No video for this lesson' : 'Select a lesson to start'}
                  </p>
                </div>
              )}
            </div>

            {/* Video info bar */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex <= 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-xs text-white/40">
                {activeIndex >= 0 ? `${activeIndex + 1} / ${totalLessons}` : ''}
              </span>
              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex >= totalLessons - 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Lesson title & meta */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-white leading-snug">
                  {activeLesson?.lesson?.title || roadmap.title}
                </h1>
                {activeLesson?.lesson?.description && (
                  <p className="text-sm text-white/50 mt-1">{activeLesson.lesson.description}</p>
                )}
              </div>
              
              {activeLesson && user && (
                <button
                  onClick={() => handleMarkAsComplete(activeLesson.lesson._id)}
                  disabled={isCompleted || markCompleteMutation.isPending}
                  className={`px-4 py-2 shrink-0 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                    isCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? 'Completed' : (markCompleteMutation.isPending ? 'Saving...' : 'Mark as Complete')}
                </button>
              )}
            </div>

            {/* Roadmap info card */}
            <div className="mt-5 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.cls}`}>
                      {diff.label}
                    </span>
                    {roadmap.category_id && (
                      <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {roadmap.category_id.icon} {roadmap.category_id.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white mb-1">{roadmap.title}</h2>
                  <p className="text-sm text-white/50 leading-relaxed">{roadmap.description}</p>

                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-white/50">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{totalModules} module{totalModules !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{roadmap.enrollment_count || 0} enrolled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Playlist Panel ─────────────────────────── */}
          <div className="w-full lg:w-[400px] shrink-0">
            {/* Playlist header */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-100px)]">
              <div className="px-4 py-4 border-b border-white/10">
                <h3 className="font-semibold text-lg text-white mb-1">{roadmap.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-white/50">
                    {roadmap.created_by?.full_name} • {activeIndex >= 0 ? `${activeIndex + 1}` : '0'} / {totalLessons}
                  </p>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module + Lesson list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {modules.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-8">No lessons yet.</p>
                ) : (
                  modules.map((mod, modIdx) => {
                    const isExpanded = expandedModules[mod._id] !== false; // default expanded
                    const lessons = mod.lessons || [];

                    return (
                      <div key={mod._id} className="border-b border-white/5 last:border-0">
                        {/* Module header */}
                        <button
                          onClick={() => toggleModule(mod._id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm font-semibold text-white/90 truncate">
                              Section {modIdx + 1}: {mod.title}
                            </p>
                          </div>
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                            : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                          }
                        </button>

                        {/* Lessons */}
                        {isExpanded && (
                          <div className="pb-2">
                            {lessons.map((lesson, lessonIdx) => {
                              const videoResource = lesson.resources?.find(r => r.type === 'video');
                              const thumb = videoResource ? getYoutubeThumbnail(videoResource.url) : null;
                              const isActive = activeLesson?.lesson._id === lesson._id;
                              const globalIdx = allLessons.findIndex(l => l.lesson._id === lesson._id);

                              return (
                                <button
                                  key={lesson._id}
                                  onClick={() => setActiveLesson({ lesson, module: mod, resource: videoResource || null })}
                                  className={`w-full flex items-start gap-3 px-3 py-2 text-left transition-colors group relative
                                    ${isActive
                                      ? 'bg-white/10'
                                      : 'hover:bg-white/5'
                                    }`}
                                >
                                  {/* Playing Indicator & Completed */}
                                  <div className="w-4 flex justify-center shrink-0 mt-3 relative">
                                    {isActive ? (
                                      <Play className="w-3 h-3 text-white" fill="currentColor" />
                                    ) : (
                                      <span className="text-[10px] text-white/40 group-hover:hidden">
                                        {completedSet.has(lesson._id) ? <Check className="w-3 h-3 text-green-500" /> : globalIdx + 1}
                                      </span>
                                    )}
                                    {!isActive && <Play className="w-3 h-3 text-white hidden group-hover:block" fill="currentColor" />}
                                  </div>

                                  {/* Thumbnail */}
                                  <div className="relative shrink-0 w-[120px] h-[68px] rounded-lg overflow-hidden bg-black/50">
                                    {thumb ? (
                                      <img
                                        src={thumb}
                                        alt={lesson.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        {videoResource ? <Play className="w-5 h-5 text-white/30" /> : <BookOpen className="w-5 h-5 text-white/30" />}
                                      </div>
                                    )}
                                    {/* Estimated Time Overlay */}
                                    {lesson.estimated_minutes > 0 && (
                                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                                        {lesson.estimated_minutes}:00
                                      </div>
                                    )}
                                  </div>

                                  {/* Lesson info */}
                                  <div className="flex-1 min-w-0 flex flex-col justify-center h-[68px]">
                                    <p className="text-[13px] leading-snug line-clamp-2 font-medium text-white/90">
                                      {lesson.title}
                                    </p>
                                    <p className="text-[11px] text-white/50 mt-1">
                                      {roadmap.created_by?.full_name}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}

                            {/* Quiz Button for Module */}
                            <div className="px-3 py-2 mt-1">
                              {(() => {
                                const isModuleComplete = lessons.length > 0 && lessons.every(l => completedSet.has(l._id));
                                return (
                                  <button
                                    onClick={() => setActiveQuizModule(mod)}
                                    disabled={!isModuleComplete}
                                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                      isModuleComplete
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
                                        : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-4 h-4" /> 
                                    {isModuleComplete ? 'Take Module Quiz' : 'Complete lessons to take Quiz'}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={!!activeQuizModule}
        onClose={() => setActiveQuizModule(null)}
        quizData={activeQuizModule ? {
          quiz: {
            _id: `mock-quiz-${activeQuizModule._id}`,
            title: `${activeQuizModule.title} Quiz`,
            passing_score: 50,
            isMock: true
          },
          questions: [
            {
              _id: 'q1',
              question: `What is the primary use case of the technologies discussed in ${activeQuizModule.title}?`,
              option_a: 'To style user interfaces',
              option_b: 'To process data on the server',
              option_c: 'Depends on the specific technology used in this module',
              option_d: 'To manage database records',
            },
            {
              _id: 'q2',
              question: `Which of the following is a best practice when working with the concepts from ${activeQuizModule.title}?`,
              option_a: 'Ignoring error handling',
              option_b: 'Writing modular and reusable code',
              option_c: 'Putting all logic in one file',
              option_d: 'Avoiding version control',
            }
          ]
        } : null}
      />

      <QuizModal
        isOpen={!!activeLessonQuiz}
        onClose={() => setActiveLessonQuiz(null)}
        onSuccess={() => {
          setActiveLessonQuiz(null);
          // Optionally go to next lesson automatically when quiz passed
          if (activeIndex >= 0 && activeIndex < totalLessons - 1) {
            goTo(activeIndex + 1);
          }
        }}
        quizData={activeLessonQuiz ? {
          quiz: {
            _id: `mock-lesson-quiz-${activeLessonQuiz._id}`,
            title: `Quiz: ${activeLessonQuiz.title}`,
            passing_score: 50,
            isMock: true
          },
          questions: [
            {
              _id: 'q1',
              question: `What did you learn from the lesson: "${activeLessonQuiz.title}"?`,
              option_a: 'I grasped the main concepts and tools.',
              option_b: 'It was somewhat confusing.',
              option_c: 'I need to watch it again.',
              option_d: 'None of the above.',
            }
          ]
        } : null}
      />
    </div>
  );
}

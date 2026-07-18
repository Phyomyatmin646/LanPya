import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Brain, ChevronLeft, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { quizService } from '@/services/quizService';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { getErrorMessage } from '@/utils/helpers';

export default function QuizPage() {
  const { lessonId } = useParams();
  const navigate     = useNavigate();
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [result,     setResult]     = useState(null);
  const [current,    setCurrent]    = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['quiz', lessonId],
    queryFn: () => quizService.getByLesson(lessonId).then(r => r.data.data),
  });

  const submitMutation = useMutation({
    mutationFn: () => quizService.submit(data.quiz._id, answers),
    onSuccess: (res) => { setResult(res.data.data); setSubmitted(true); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Skeleton className="h-12 rounded-xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
  if (isError) return <ErrorState message="No quiz found for this lesson." onRetry={refetch} />;

  const { quiz, questions = [] } = data;
  const q = questions[current];

  const handleReset = () => { setAnswers({}); setSubmitted(false); setResult(null); setCurrent(0); };

  // Results screen
  if (submitted && result) {
    const pct = result.score;
    const passed = pct >= (quiz.passing_score || 70);
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <motion.div className="card p-8 text-center" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {passed ? <Trophy className="w-10 h-10 text-emerald-500" /> : <XCircle className="w-10 h-10 text-red-400" />}
          </div>
          <h2 className="font-display font-bold text-3xl text-dark mb-2">
            {passed ? 'Quiz Passed! 🎉' : 'Keep Trying!'}
          </h2>
          <p className="text-gray-500 mb-6">
            You scored <span className="font-bold text-2xl gradient-text">{pct}%</span> · {result.correct}/{result.total} correct
          </p>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
            <div className={`h-3 rounded-full transition-all duration-700 ${passed ? 'bg-emerald-500' : 'bg-red-400'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleReset} className="btn btn-outline btn-md gap-2">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-primary btn-md gap-2">
              <ChevronLeft className="w-4 h-4" /> Back to Lesson
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 text-center">
        <Brain className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500">No questions in this quiz yet.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-1 text-gray-500">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            <h1 className="font-display font-semibold text-lg text-dark">{quiz.title}</h1>
          </div>
          <span className="badge badge-primary">{current + 1}/{questions.length}</span>
        </div>

        {/* Progress */}
        <div className="progress-bar mb-6">
          <div className="progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-4">
            <h2 className="font-medium text-dark text-lg">{q.question}</h2>

            <div className="space-y-3">
              {(q.options || []).map((opt, idx) => {
                const selected = answers[q._id] === idx;
                return (
                  <button key={idx} onClick={() => setAnswers(prev => ({ ...prev, [q._id]: idx }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                      selected
                        ? 'border-secondary bg-secondary/5 text-secondary'
                        : 'border-gray-100 hover:border-primary/30 hover:bg-primary/3 text-gray-700'
                    }`}>
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? 'border-secondary bg-secondary text-white' : 'border-gray-200'}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between mt-6">
          <button
            className="btn btn-ghost btn-md" disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}>Previous</button>

          {current < questions.length - 1 ? (
            <button
              className="btn btn-primary btn-md"
              disabled={answers[q._id] === undefined}
              onClick={() => setCurrent(c => c + 1)}>Next</button>
          ) : (
            <button
              className="btn btn-success btn-md gap-2"
              disabled={Object.keys(answers).length < questions.length || submitMutation.isPending}
              onClick={() => submitMutation.mutate()}>
              <CheckCircle className="w-4 h-4" />
              {submitMutation.isPending ? 'Submitting…' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

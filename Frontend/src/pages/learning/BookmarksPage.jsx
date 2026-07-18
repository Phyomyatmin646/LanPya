import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookmarkService } from '@/services/lessonService';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/States';

export default function BookmarksPage() {
  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getMyBookmarks().then(r => r.data.data),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookmarks</h1>
          <p className="page-subtitle">Your saved lessons for quick access.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : bookmarks.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet"
          description="Bookmark lessons while studying to save them here." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookmarks.map((bm, i) => {
            const lesson = bm.lesson_id;
            const id     = typeof lesson === 'object' ? lesson?._id : lesson;
            return (
              <motion.div key={bm._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <div className="card-hover p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">{lesson?.title || 'Lesson'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Saved lesson</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

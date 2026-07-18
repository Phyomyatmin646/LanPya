import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { notificationService } from '@/services/miscService';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/States';
import { timeAgo } from '@/utils/helpers';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  info:    'bg-blue-100 text-blue-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error:   'bg-red-100 text-red-600',
};

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll().then(r => r.data.data),
  });

  const markRead = useMutation({
    mutationFn: (id) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries(['notifications']),
  });

  const markAll = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => { qc.invalidateQueries(['notifications']); toast.success('All marked as read'); },
  });

  const remove = useMutation({
    mutationFn: (id) => notificationService.remove(id),
    onSuccess: () => qc.invalidateQueries(['notifications']),
  });

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={() => markAll.mutate()} disabled={markAll.isPending}
            className="btn btn-outline btn-sm gap-1">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Check back later." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div key={n._id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`card p-4 flex items-start gap-4 transition-all ${!n.is_read ? 'border-l-4 border-l-secondary' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-dark">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!n.is_read && (
                  <button onClick={() => markRead.mutate(n._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => remove.mutate(n._id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

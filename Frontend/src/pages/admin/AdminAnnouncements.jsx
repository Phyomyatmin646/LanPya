import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { announcementService } from '@/services/miscService';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/States';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { getErrorMessage, formatDate } from '@/utils/helpers';

export default function AdminAnnouncements() {
  const qc = useQueryClient();
  const [modalOpen,    setModalOpen]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: anns = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementService.getAll().then(r => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data) => announcementService.create(data),
    onSuccess: () => {
      toast.success('Announcement published!');
      qc.invalidateQueries(['announcements']);
      setModalOpen(false);
      reset();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Broadcast messages to all users.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-md gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
      ) : anns.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" action={
          <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-md">Create First Announcement</button>
        } />
      ) : (
        <div className="space-y-4">
          {anns.map((ann, i) => (
            <motion.div key={ann._id} className="card p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark">{ann.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ann.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {ann.created_by && (
                        <span className="text-xs text-gray-400">by {ann.created_by?.full_name}</span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(ann.created_at)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setDeleteTarget(ann._id)}
                  className="w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div className="form-group">
            <label className="label">Title</label>
            <input className={`input ${errors.title ? 'input-error' : ''}`}
              {...register('title', { required: 'Required' })} placeholder="Announcement title" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Message</label>
            <textarea className={`input resize-none ${errors.body ? 'input-error' : ''}`} rows={4}
              {...register('body', { required: 'Required' })} placeholder="Your announcement…" />
            {errors.body && <p className="form-error">{errors.body.message}</p>}
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn btn-ghost btn-md" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="btn btn-primary btn-md gap-2">
              <Megaphone className="w-4 h-4" />
              {createMutation.isPending ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { /* announcements don't have delete route in backend */ setDeleteTarget(null); toast('Delete not supported via API'); }}
        title="Delete Announcement?" description="This will remove the announcement." />
    </div>
  );
}

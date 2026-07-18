import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Map, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { roadmapService } from '@/services/roadmapService';
import { categoryService } from '@/services/categoryService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { DifficultyBadge } from '@/components/ui/Badge';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { getErrorMessage, formatDate, truncate } from '@/utils/helpers';

export default function AdminRoadmaps() {
  const qc = useQueryClient();
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [difficulty,   setDifficulty]   = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-roadmaps', { page, search, difficulty }],
    queryFn: () => roadmapService.getAll({ page, limit: 10, search, difficulty }).then(r => r.data),
    keepPreviousData: true,
  });

  const { data: cats = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const openCreate = () => {
    setEditTarget(null);
    reset({ title:'', description:'', difficulty:'beginner', estimated_duration:'', is_public: true });
    setModalOpen(true);
  };
  const openEdit = (rm) => {
    setEditTarget(rm);
    setValue('title',              rm.title);
    setValue('description',        rm.description);
    setValue('difficulty',         rm.difficulty);
    setValue('estimated_duration', rm.estimated_duration);
    setValue('category_id',        rm.category_id?._id || rm.category_id);
    setModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: (data) => editTarget
      ? roadmapService.update(editTarget._id, data)
      : roadmapService.create(data),
    onSuccess: () => {
      toast.success(editTarget ? 'Roadmap updated!' : 'Roadmap created!');
      qc.invalidateQueries(['admin-roadmaps']);
      qc.invalidateQueries(['roadmaps']);
      setModalOpen(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => roadmapService.remove(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['admin-roadmaps']); qc.invalidateQueries(['roadmaps']); setDeleteTarget(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const roadmaps   = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / 10);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roadmaps</h1>
          <p className="page-subtitle">{data?.meta?.total || 0} roadmaps</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-2">
          <Plus className="w-4 h-4" /> New Roadmap
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search roadmaps…" className="flex-1" />
        <select className="input !w-auto" value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(1); }}>
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {isLoading ? <TableSkeleton rows={8} cols={5} />
       : isError  ? <ErrorState onRetry={refetch} />
       : roadmaps.length === 0 ? (
        <EmptyState icon={Map} title="No roadmaps" action={<button onClick={openCreate} className="btn btn-primary btn-md">Create First Roadmap</button>} />
       ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Public</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.map((rm, i) => (
                  <motion.tr key={rm._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <td>
                      <p className="font-medium text-dark text-sm">{rm.title}</p>
                      <p className="text-xs text-gray-400">{truncate(rm.description, 50)}</p>
                    </td>
                    <td className="text-sm text-gray-600">{rm.category_id?.name || '—'}</td>
                    <td><DifficultyBadge difficulty={rm.difficulty} /></td>
                    <td>
                      <span className={`badge ${rm.is_public ? 'badge-success' : 'badge-neutral'}`}>
                        {rm.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">{formatDate(rm.created_at)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(rm)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(rm._id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Roadmap' : 'New Roadmap'} size="lg">
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div className="form-group">
            <label className="label">Title</label>
            <input className={`input ${errors.title ? 'input-error' : ''}`}
              {...register('title', { required: 'Required' })} placeholder="Roadmap title" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Category</label>
              <select className="input" {...register('category_id', { required: 'Required' })}>
                <option value="">Select category</option>
                {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="form-error">{errors.category_id.message}</p>}
            </div>
            <div className="form-group">
              <label className="label">Difficulty</label>
              <select className="input" {...register('difficulty')}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Duration (e.g. "4 weeks")</label>
              <input className="input" {...register('estimated_duration')} placeholder="4 weeks" />
            </div>
            <div className="form-group">
              <label className="label">Thumbnail URL</label>
              <input className="input" {...register('thumbnail')} placeholder="https://…" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_public" {...register('is_public')} className="w-4 h-4 accent-primary" />
            <label htmlFor="is_public" className="text-sm text-gray-700">Make public</label>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn btn-ghost btn-md" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" disabled={saveMutation.isPending} className="btn btn-primary btn-md">
              {saveMutation.isPending ? 'Saving…' : editTarget ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget)} loading={deleteMutation.isPending}
        title="Delete Roadmap?" description="This will permanently remove the roadmap." />
    </div>
  );
}

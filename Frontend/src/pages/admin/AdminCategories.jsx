import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { categoryService } from '@/services/categoryService';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { getErrorMessage, formatDate } from '@/utils/helpers';

export default function AdminCategories() {
  const qc = useQueryClient();
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: cats = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll().then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const openCreate = () => { setEditTarget(null); reset({ name: '', description: '' }); setModalOpen(true); };
  const openEdit   = (cat) => { setEditTarget(cat); setValue('name', cat.name); setValue('description', cat.description); setModalOpen(true); };

  const saveMutation = useMutation({
    mutationFn: (data) => editTarget
      ? categoryService.update(editTarget._id, data)
      : categoryService.create(data),
    onSuccess: () => {
      toast.success(editTarget ? 'Category updated!' : 'Category created!');
      qc.invalidateQueries(['categories']);
      setModalOpen(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryService.remove(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['categories']); setDeleteTarget(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage learning categories.</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-md gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {isLoading ? <Skeleton className="h-64 rounded-2xl" />
       : isError  ? <ErrorState onRetry={refetch} />
       : cats.length === 0 ? (
        <EmptyState icon={Tag} title="No categories"
          action={<button onClick={openCreate} className="btn btn-primary btn-md">Add First Category</button>} />
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat, i) => (
            <motion.div key={cat._id} className="card p-5"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(cat._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-dark">{cat.name}</h3>
              {cat.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>}
              <p className="text-xs text-gray-400 mt-3">{formatDate(cat.created_at)}</p>
            </motion.div>
          ))}
        </div>
       )}

      {/* Create/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <div className="form-group">
            <label className="label">Name</label>
            <input className={`input ${errors.name ? 'input-error' : ''}`}
              {...register('name', { required: 'Required' })} placeholder="e.g. Web Development" />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description…"
              {...register('description')} />
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
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Category?" description="All associated content may be affected." />
    </div>
  );
}

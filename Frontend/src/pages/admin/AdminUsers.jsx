import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, Trash2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { userService } from '@/services/userService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Avatar } from '@/components/ui/Avatar';
import { RoleBadge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/ui/SearchBar';
import { ConfirmDialog } from '@/components/ui/Modal';
import { formatDate, getErrorMessage } from '@/utils/helpers';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState('');
  const [sortBy,  setSortBy]  = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', { page, search, sortBy, sortDir }],
    queryFn: () => userService.getAll({ page, limit: 10, search, sort: sortBy, order: sortDir }).then(r => r.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.remove(id),
    onSuccess: () => { toast.success('User deleted'); qc.invalidateQueries(['admin-users']); setDeleteId(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => sortBy === col
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : null;

  const users      = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / 10);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{data?.meta?.total || 0} total users</p>
        </div>
      </div>

      <div className="flex gap-3">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search users…" className="max-w-sm" />
      </div>

      {isLoading ? <TableSkeleton rows={8} cols={5} />
       : isError ? <ErrorState onRetry={refetch} />
       : users.length === 0 ? <EmptyState icon={Users} title="No users found" />
       : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th className="cursor-pointer hover:text-primary" onClick={() => toggleSort('email')}>
                    <span className="flex items-center gap-1">Email <SortIcon col="email" /></span>
                  </th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="cursor-pointer hover:text-primary" onClick={() => toggleSort('created_at')}>
                    <span className="flex items-center gap-1">Joined <SortIcon col="created_at" /></span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr key={u._id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar} name={u.full_name} size="sm" />
                        <div>
                          <p className="font-medium text-dark text-sm">{u.full_name}</p>
                          <p className="text-xs text-gray-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{u.email}</td>
                    <td><RoleBadge role={u.role_id?.name} /></td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">{formatDate(u.created_at)}</td>
                    <td>
                      <button onClick={() => setDeleteId(u._id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete User?" description="This action cannot be undone." />
    </div>
  );
}

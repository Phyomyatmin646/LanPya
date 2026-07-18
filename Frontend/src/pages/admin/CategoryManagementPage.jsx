import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Edit2, Trash2 } from 'lucide-react';

export default function CategoryManagementPage() {
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => roadmapService.getCategories(),
  });

  const categories = categoriesResponse?.data?.data || [];

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#24292F]">Manage Categories</h1>
        <button className="btn btn-primary">New Category</button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : (
        <div className="gh-box overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#D0D7DE]">
                <th className="px-4 py-2 font-semibold text-[#57606A]">Name</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Description</th>
                <th className="px-4 py-2 font-semibold text-[#57606A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} className="border-b border-[#D0D7DE] last:border-0 hover:bg-[#F6F8FA]">
                  <td className="px-4 py-3 font-medium text-[#24292F]">{cat.name}</td>
                  <td className="px-4 py-3 text-[#57606A] truncate max-w-xs">{cat.description}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#0969DA] hover:underline mr-3"><Edit2 className="w-4 h-4 inline" /></button>
                    <button className="text-[#CF222E] hover:underline"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-[#57606A]">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

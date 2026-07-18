import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roadmapService } from '../../services/roadmapService';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Edit2, Trash2, List } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadmapManagementPage() {
  const { data: roadmapsResponse, isLoading } = useQuery({
    queryKey: ['admin', 'roadmaps'],
    queryFn: () => roadmapService.getAll({ limit: 100 }),
  });

  const roadmaps = roadmapsResponse?.data?.data || [];

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#24292F]">Manage Roadmaps</h1>
        <button className="btn btn-primary">New Roadmap</button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="gh-box overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#D0D7DE]">
                <th className="px-4 py-2 font-semibold text-[#57606A]">Title</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Category</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Level</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Status</th>
                <th className="px-4 py-2 font-semibold text-[#57606A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roadmaps.map(roadmap => (
                <tr key={roadmap._id} className="border-b border-[#D0D7DE] last:border-0 hover:bg-[#F6F8FA]">
                  <td className="px-4 py-3 font-medium text-[#0969DA] hover:underline cursor-pointer">
                    <Link to={`/roadmaps/${roadmap._id}`}>{roadmap.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-[#57606A]">{roadmap.category?.name || '-'}</td>
                  <td className="px-4 py-3 text-[#57606A] uppercase text-xs">{roadmap.level}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[#D0D7DE] text-[#57606A]">
                      {roadmap.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#57606A] hover:text-[#24292F] mr-3" title="Manage Modules"><List className="w-4 h-4 inline" /></button>
                    <button className="text-[#0969DA] hover:underline mr-3"><Edit2 className="w-4 h-4 inline" /></button>
                    <button className="text-[#CF222E] hover:underline"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              ))}
              {roadmaps.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#57606A]">No roadmaps found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

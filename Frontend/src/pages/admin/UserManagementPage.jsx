import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { miscService } from '../../services/miscService';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { SearchBar } from '../../components/ui/SearchBar';
import { Settings, Shield } from 'lucide-react';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['admin', 'users', searchTerm],
    queryFn: () => miscService.getPlatformStats(), // Mocking users list for now
  });

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#24292F]">Manage Users</h1>
        <button className="btn btn-primary">Invite User</button>
      </div>
      
      <div className="mb-4 w-full md:w-1/3">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Find a user..." />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="gh-box overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F6F8FA] border-b border-[#D0D7DE]">
                <th className="px-4 py-2 font-semibold text-[#57606A]">Name</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Username</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Email</th>
                <th className="px-4 py-2 font-semibold text-[#57606A]">Role</th>
                <th className="px-4 py-2 font-semibold text-[#57606A] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Dummy data as endpoint isn't fully implemented for direct user list in our frontend yet */}
              {[1,2,3].map(i => (
                <tr key={i} className="border-b border-[#D0D7DE] last:border-0 hover:bg-[#F6F8FA]">
                  <td className="px-4 py-3 font-medium text-[#24292F]">Test User {i}</td>
                  <td className="px-4 py-3 text-[#57606A]">testuser{i}</td>
                  <td className="px-4 py-3 text-[#57606A]">user{i}@example.com</td>
                  <td className="px-4 py-3">
                    <Badge variant={i === 1 ? 'primary' : 'default'}>
                      {i === 1 ? 'admin' : 'student'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[#57606A] hover:text-[#0969DA] p-1"><Settings className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

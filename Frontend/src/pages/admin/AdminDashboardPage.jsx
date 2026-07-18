import { Users, BookOpen, Database, FolderTree } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,245', icon: Users, color: 'text-blue-500', path: '/admin/users' },
    { label: 'Active Roadmaps', value: '42', icon: BookOpen, color: 'text-green-500', path: '/admin/roadmaps' },
    { label: 'Categories', value: '18', icon: FolderTree, color: 'text-purple-500', path: '/admin/categories' },
    { label: 'RAG Documents', value: '156', icon: Database, color: 'text-orange-500', path: '/admin/rag' },
  ];

  return (
    <div className="container-gh py-8">
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D0D7DE]">
        <h1 className="text-2xl font-semibold text-[#24292F]">Administration</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.path} className="gh-box p-4 hover:border-[#8C959F] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#57606A]">{stat.label}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-semibold text-[#24292F]">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gh-box">
          <div className="gh-box-header">
            Quick Actions
          </div>
          <div className="p-0">
            <ul className="divide-y divide-[#D0D7DE]">
              <li className="p-4 hover:bg-[#F6F8FA] transition-colors">
                <Link to="/admin/roadmaps" className="text-sm font-medium text-[#0969DA] hover:underline">Create new roadmap</Link>
                <p className="text-xs text-[#57606A] mt-1">Publish a new learning path for users.</p>
              </li>
              <li className="p-4 hover:bg-[#F6F8FA] transition-colors">
                <Link to="/admin/rag" className="text-sm font-medium text-[#0969DA] hover:underline">Upload knowledge documents</Link>
                <p className="text-xs text-[#57606A] mt-1">Add markdown or text files to the AI vector database.</p>
              </li>
              <li className="p-4 hover:bg-[#F6F8FA] transition-colors">
                <Link to="/admin/users" className="text-sm font-medium text-[#0969DA] hover:underline">Manage user roles</Link>
                <p className="text-xs text-[#57606A] mt-1">Promote users to instructors or admins.</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="gh-box">
          <div className="gh-box-header">
            System Status
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57606A]">Database (MongoDB)</span>
                <span className="flex items-center gap-1 text-[#1A7F37] font-medium"><div className="w-2 h-2 rounded-full bg-[#1A7F37]"></div> Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57606A]">AI Engine (Gemini)</span>
                <span className="flex items-center gap-1 text-[#1A7F37] font-medium"><div className="w-2 h-2 rounded-full bg-[#1A7F37]"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57606A]">Vector Store (RAG)</span>
                <span className="flex items-center gap-1 text-[#1A7F37] font-medium"><div className="w-2 h-2 rounded-full bg-[#1A7F37]"></div> Operational</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#57606A]">Email Service</span>
                <span className="flex items-center gap-1 text-[#E3B341] font-medium"><div className="w-2 h-2 rounded-full bg-[#E3B341]"></div> Degraded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

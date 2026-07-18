import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Map, BookOpen, TrendingUp, Activity } from 'lucide-react';
import { userService } from '@/services/userService';
import { roadmapService } from '@/services/roadmapService';
import { enrollmentService } from '@/services/enrollmentService';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/utils/helpers';
import { RoleBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#3E276D', '#8955F3', '#22c55e', '#f59e0b'];

export default function AdminDashboard() {
  const { data: usersData,   isLoading: lu } = useQuery({ queryKey: ['admin-users', {}],   queryFn: () => userService.getAll({ limit: 5 }).then(r => r.data) });
  const { data: roadmapsData, isLoading: lr } = useQuery({ queryKey: ['roadmaps', {}],     queryFn: () => roadmapService.getAll({ limit: 100 }).then(r => r.data) });

  const users    = usersData?.data    || [];
  const roadmaps = roadmapsData?.data || [];

  const diffCounts = roadmaps.reduce((acc, r) => {
    acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(diffCounts).map(([name, value]) => ({ name, value }));

  const stats = [
    { icon: Users,     label: 'Total Users',    value: usersData?.meta?.total || 0,    color: 'bg-primary/10 text-primary' },
    { icon: Map,       label: 'Roadmaps',       value: roadmapsData?.meta?.total || 0, color: 'bg-secondary/10 text-secondary' },
    { icon: BookOpen,  label: 'Categories',     value: '—',                            color: 'bg-emerald-100 text-emerald-600' },
    { icon: TrendingUp,label: 'Avg Progress',   value: '—',                            color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and analytics.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} className="stat-card"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className={`stat-icon ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-display font-bold text-dark">{lu || lr ? '—' : value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmaps by difficulty chart */}
        <div className="card p-5 lg:col-span-1">
          <h2 className="font-display font-semibold text-base text-dark mb-4">Roadmaps by Difficulty</h2>
          {lr ? <Skeleton className="h-48" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent users */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-display font-semibold text-base text-dark mb-4">Recent Users</h2>
          {lu ? <Skeleton className="h-48" /> : (
            <div className="space-y-3">
              {users.slice(0, 5).map(u => (
                <div key={u._id} className="flex items-center gap-3">
                  <Avatar src={u.avatar} name={u.full_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{u.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role_id?.name} />
                    <span className="text-xs text-gray-400">{formatDate(u.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

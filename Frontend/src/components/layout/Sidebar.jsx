import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, BookOpen, Settings, LayoutDashboard, Database, Users, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'My Learning', icon: BookOpen, path: '/learning' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const adminItems = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Manage Users', icon: Users, path: '/admin/users' },
    { label: 'Knowledge Base', icon: Database, path: '/admin/rag' },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    
    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
          ${isActive 
            ? 'bg-[#F3F4F6] text-[#24292F]' 
            : 'text-[#57606A] hover:bg-[#F3F4F6] hover:text-[#24292F]'
          }
        `}
      >
        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#24292F]' : 'text-[#8C959F]'}`} />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#1F2328]/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-64px)] w-64 bg-white border-r border-[#D0D7DE] transform transition-transform duration-200 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#57606A] uppercase tracking-wider mb-2 px-3">
              Menu
            </h3>
            <nav className="space-y-1">
              {navItems.map(item => (
                <NavLink key={item.path} item={item} />
              ))}
            </nav>
          </div>

          {user?.role?.name === 'admin' && (
            <div>
              <h3 className="text-xs font-semibold text-[#57606A] uppercase tracking-wider mb-2 px-3 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Administration
              </h3>
              <nav className="space-y-1">
                {adminItems.map(item => (
                  <NavLink key={item.path} item={item} />
                ))}
              </nav>
            </div>
          )}

        </div>
        
        <div className="p-4 border-t border-[#D0D7DE] text-xs text-[#57606A]">
          <p>© 2026 LanPya Platform</p>
        </div>
      </aside>
    </>
  );
}

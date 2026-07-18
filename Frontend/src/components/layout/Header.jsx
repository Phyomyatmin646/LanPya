import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Search, Bell, Menu, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/Avatar';

export function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0715] border-b border-white/10 text-white shadow-sm h-[76px] flex items-center px-5 lg:px-8 justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="md:hidden text-[#8C959F] hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <Link to="/" className="flex items-center gap-2 text-white hover:text-white/80 transition-opacity">
          <img
            src="/LanPya_logo.png"
            alt="LanPya Logo"
            className="w-11 h-11 object-contain"
          />
        </Link>

        {user && (
          <nav className="hidden lg:flex items-center gap-1 ml-4 text-sm font-medium">
            <Link to="/dashboard" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Dashboard</Link>
            <Link to="/explore" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Explore</Link>
            <Link to="/learning" className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">My Learning</Link>
            {user.role?.name === 'admin' && (
              <Link to="/admin" className="px-3 py-1.5 rounded-md text-accent hover:bg-white/10 transition-colors">Admin</Link>
            )}
          </nav>
        )}

        {/* Global Search Bar */}
        <div className="hidden md:flex max-w-md w-full ml-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C959F]" />
            <input 
              type="text"
              placeholder="Search or jump to..."
              className="w-full bg-[#24292F] border border-[#57606A] text-white text-sm rounded-md pl-9 pr-3 py-1.5 focus:bg-white focus:text-[#24292F] focus:border-accent focus:ring-2 focus:ring-accent/40 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button className="text-[#8C959F] hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border border-[#24292F]"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <Avatar fallback={user.username} size="sm" className="border-none" />
                <span className="w-2 h-2 border-l border-b border-current transform -rotate-45 ml-1 mt-[-2px] text-[#8C959F]"></span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white gh-border rounded-md shadow-lg py-1 text-sm text-[#24292F]">
                  <div className="px-4 py-2 border-b border-[#D0D7DE]">
                    <p className="font-medium">Signed in as</p>
                    <p className="font-semibold truncate">{user.username}</p>
                  </div>
                  
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-[#F3F4F6] hover:text-accent">
                    <UserIcon className="w-4 h-4" /> Your profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-[#F3F4F6] hover:text-accent">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  
                  <div className="border-t border-[#D0D7DE] my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-[#F3F4F6] text-[#CF222E]"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Link to="/login" className="text-white hover:text-gray-300 font-medium">Sign in</Link>
            <Link to="/register" className="border border-white/40 hover:border-white text-white px-2 py-1 rounded-md font-medium transition-colors">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}

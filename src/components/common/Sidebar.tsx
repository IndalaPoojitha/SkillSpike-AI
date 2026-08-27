import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Compass,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  FileSearch,
  LineChart,
  User,
  LogOut,
  Flame,
  Bot,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { userProfile, isDemoUser, logout } = useAuth();
  const { setIsChatOpen } = useData();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'AI Roadmap', path: '/roadmap', icon: Compass, badge: 'AI' },
    { label: 'DSA Practice', path: '/dsa', icon: Code2, badge: '30+ Problems' },
    { label: 'Aptitude Practice', path: '/aptitude', icon: BrainCircuit, badge: null },
    { label: 'Interview Coach', path: '/interview', icon: MessageSquareCode, badge: 'AI Voice' },
    { label: 'Resume Analyzer', path: '/resume-analyzer', icon: FileSearch, badge: 'ATS' },
    { label: 'Progress Analytics', path: '/progress', icon: LineChart, badge: null },
    { label: 'My Profile', path: '/profile', icon: User, badge: null },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white leading-tight text-lg">
                SkillSpike <span className="text-blue-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Placement Suite
              </span>
            </div>
          </div>
        </NavLink>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Quick Info */}
      <div className="px-4 py-3.5 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userProfile?.name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {userProfile?.name || 'Demo Student'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {userProfile?.targetRole || 'Software Developer'}
            </p>
          </div>
        </div>
        <div
          className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold"
          title="Current Daily Preparation Streak"
        >
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{userProfile?.currentStreak || 5}d</span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Placement Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-tight ${
                    item.badge === 'AI' || item.badge === 'AI Voice'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-700/80 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* AI Assistant Banner */}
      <div className="p-3">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900/60 to-blue-900/60 border border-indigo-500/30">
          <div className="flex items-center space-x-2 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-white">AI Career Assistant</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug mb-2.5">
            Ask placement questions, request custom DSA plans, or company guides.
          </p>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setMobileOpen(false);
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-sm"
          >
            <span>Open Assistant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

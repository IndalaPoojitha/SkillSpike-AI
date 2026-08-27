import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Menu, Flame, Sparkles, Bot, GraduationCap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title, subtitle }) => {
  const { userProfile, isDemoUser } = useAuth();
  const { setIsChatOpen, isChatOpen } = useData();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Target role pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
          <Target className="w-3.5 h-3.5 text-blue-600" />
          <span className="truncate max-w-[140px]">
            {userProfile?.targetRole || 'Software Developer'}
          </span>
        </div>

        {/* Daily Streak Indicator */}
        <div
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-xs cursor-default"
          title="Daily Preparation Streak. Practice every day to keep it glowing!"
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
          <span>{userProfile?.currentStreak || 5} Day Streak</span>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Career Mentor</span>
        </button>

        {/* Profile Avatar & College Tooltip */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          title={`${userProfile?.name} - ${userProfile?.college}`}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            {userProfile?.name?.charAt(0) || 'S'}
          </div>
        </Link>
      </div>
    </header>
  );
};

import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: string;
  textSize?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconSize = 'w-9 h-9',
  textSize = 'text-xl',
  showTagline = false,
}) => {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 flex-shrink-0 transition-transform duration-200 hover:scale-105`}
      >
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 leading-tight ${textSize}`}>
          SkillSpike <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
            Your AI Placement Companion
          </span>
        )}
      </div>
    </div>
  );
};

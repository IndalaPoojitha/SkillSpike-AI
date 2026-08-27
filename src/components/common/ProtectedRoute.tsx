import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userProfile, loading, isDemoUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            SkillSpike <span className="text-blue-600">AI</span>
          </span>
        </div>
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-600 animate-indeterminate rounded-full"></div>
        </div>
        <p className="mt-3 text-sm text-slate-500">Loading your placement workspace...</p>
      </div>
    );
  }

  if (!userProfile && !isDemoUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

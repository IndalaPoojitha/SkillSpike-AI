import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Header } from '../common/Header';
import { ToastContainer } from '../common/ToastContainer';
import { AIChatFloating } from '../common/AIChatFloating';

interface DashboardLayoutProps {
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <main className="flex-1 pb-16">
          <Outlet context={{ setMobileSidebarOpen }} />
        </main>
      </div>

      {/* Persistent Floating AI Mentor & Toasts */}
      <AIChatFloating />
      <ToastContainer />
    </div>
  );
};

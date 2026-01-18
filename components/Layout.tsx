
import React from 'react';
import Sidebar from './Sidebar.tsx';
import Topbar from './Topbar.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Navigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-obsidian-950 flex transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f1f5f9] dark:bg-[#09090b] text-slate-800 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f1f5f9] dark:bg-[#09090b] p-2 md:p-3 relative transition-colors duration-200">
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in lg:h-full lg:flex lg:flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

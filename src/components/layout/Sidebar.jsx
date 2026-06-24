import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Layers,
  Cpu,
  Users,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  X,
  Calendar,
  CheckSquare
} from 'lucide-react';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import lexaLogo from '../../assets/lexa.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const menuGroups = [
    {
      title: 'MAIN MENU',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: Briefcase },
        { name: 'Case Studies', path: '/case-studies', icon: BookOpen },
        { name: 'Services', path: '/services', icon: Layers },
        { name: 'Technologies', path: '/technologies', icon: Cpu },
        { name: 'Testimonials', path: '/testimonials', icon: MessageSquare },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Team Members', path: '/team', icon: Users },
        { name: 'Documents', path: '/documents', icon: FileText },
        { name: 'Tasks', path: '#tasks', icon: CheckSquare, isMock: true },
        { name: 'Calendar', path: '#calendar', icon: Calendar, isMock: true },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  const handleMockClick = (e, name) => {
    e.preventDefault();
    alert(`${name} module is currently not in scope for this milestone.`);
  };

  const handleSignOut = () => {
    Swal.fire({
      title: 'Sign Out',
      text: 'Are you sure you want to sign out from the portal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb', // blue
      cancelButtonColor: '#475569',  // slate-600
      background: '#0f172a',         // slate-900 matching sidebar
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-2xl border border-slate-700',
        title: 'font-bold text-white',
        htmlContainer: 'text-slate-400 text-sm font-medium',
        confirmButton: 'px-4 py-2 text-sm font-bold rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-bold rounded-lg',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-[#0a0f1d] border-r border-[#1e293b] flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1e293b] bg-[#0b1329]/50">
          <div className="flex items-center space-x-2.5">
            <img src={lexaLogo} alt="LEXA Logo" className="h-7 object-contain brightness-0 invert" />
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
              ADMIN
            </span>
          </div>
          {/* Close Button on Mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-4 text-[10px] font-extrabold text-slate-500 tracking-widest uppercase">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  if (item.isMock) {
                    return (
                      <a
                        key={item.name}
                        href={item.path}
                        onClick={(e) => handleMockClick(e, item.name)}
                        className="flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors group opacity-60"
                      >
                        <Icon className="w-4.5 h-4.5 mr-3 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
                        {item.name}
                      </a>
                    );
                  }

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 group border-l-2',
                          isActive
                            ? 'bg-[#1e293b] text-white border-blue-500'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={clsx(
                              'w-4.5 h-4.5 mr-3 flex-shrink-0 transition-colors',
                              isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-300'
                            )}
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer (Figma Profile Card style) */}
        {user && (
          <div className="p-4 border-t border-[#1e293b] bg-[#0b1329]/30">
            <div className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Admin Lexa</p>
                  <p className="text-[10px] text-slate-500 truncate font-semibold capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

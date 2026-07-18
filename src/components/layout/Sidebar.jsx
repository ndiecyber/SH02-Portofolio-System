import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
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
  CheckSquare,
  UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import lexaLogo from '../../assets/lexa.svg';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const roleChecker = useRole();

  // Dynamic route checking
  const showCaseStudies = roleChecker.isCEO || roleChecker.isPM || (roleChecker.isIntern && !roleChecker.isLearningIntern);
  const showServices = roleChecker.isCEO || roleChecker.isPM;
  const showTechnologies = roleChecker.isCEO || roleChecker.isPM || roleChecker.isDeveloper || roleChecker.isIntern;
  const showTestimonials = roleChecker.isCEO || roleChecker.isPM || roleChecker.isClient || roleChecker.isJuniorIntern;
  const showTeam = !roleChecker.isClient; // Clients see names inside projects, hide general directory
  const showDocuments = !roleChecker.isClient; // Clients have no access to docs

  const menuGroups = [
    {
      title: 'MAIN MENU',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
        { name: 'Projects', path: '/projects', icon: Briefcase, show: true },
        { name: 'Case Studies', path: '/case-studies', icon: BookOpen, show: showCaseStudies },
        { name: 'Services', path: '/services', icon: Layers, show: showServices },
        { name: 'Technologies', path: '/technologies', icon: Cpu, show: showTechnologies },
        { name: 'Testimonials', path: '/testimonials', icon: MessageSquare, show: showTestimonials },
      ].filter(item => item.show)
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Manajemen Tim', path: '/team', icon: Users, show: showTeam },
        { name: 'Documents', path: '/documents', icon: FileText, show: showDocuments },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare, show: !roleChecker.isClient },
        { name: 'Calendar', path: '/calendar', icon: Calendar, show: !roleChecker.isClient },
      ].filter(item => item.show)
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Manajemen User', path: '/users', icon: UserCheck, show: roleChecker.canViewUserManagement() },
        { name: 'Settings', path: '/settings', icon: Settings, show: roleChecker.canViewSettings() },
      ].filter(item => item.show)
    }
  ].filter(group => group.items.length > 0);

  const handleMockClick = (e, name) => {
    e.preventDefault();
    Swal.fire({
      title: 'Not in Scope',
      text: `Modul ${name} tidak masuk dalam cakupan pengerjaan milestone ini.`,
      icon: 'info',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#2563eb'
    });
  };

  const handleSignOut = () => {
    Swal.fire({
      title: 'Sign Out',
      text: 'Apakah Anda yakin ingin keluar dari portal manajemen portfolio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-2xl border border-slate-700',
        title: 'font-bold text-white',
        htmlContainer: 'text-slate-350 text-xs font-semibold',
        confirmButton: 'px-4 py-2 text-xs font-bold rounded-lg',
        cancelButton: 'px-4 py-2 text-xs font-bold rounded-lg',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (roleChecker.isIntern) {
      return `Intern - ${user.magang_tier}`;
    }
    return user.role.replace(/_/g, ' ');
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
          'fixed inset-y-0 left-0 w-64 bg-[#0d1b3e] dark:bg-transparent flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={undefined}
      >
        {/* Dark mode: gradient sidebar with accent top glow */}
        <div className="hidden dark:block absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, #0d0d10 0%, #111113 100%)'
        }} />
        <div className="hidden dark:block absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)'
        }} />
        {/* Light mode sidebar stays as original navy */}
        <div className="dark:hidden absolute inset-0 bg-[#0d1b3e] pointer-events-none" />
        {/* Sidebar Header */}
        <div className="relative z-10 h-12 flex items-center justify-between px-4 border-b border-white/5 bg-black/10">
          <div className="flex items-center space-x-2.5">
            <img src={lexaLogo} alt="LEXA Logo" className="h-7 object-contain brightness-0 invert" />
          </div>
          {/* Close Button on Mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="relative z-10 flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-4 text-[9px] font-extrabold text-slate-500 tracking-widest uppercase">
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
                        className="flex items-center px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors group opacity-60"
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
                          'flex items-center px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 group border-l-2',
                          isActive
                            ? 'bg-blue-600 text-white border-transparent'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={clsx(
                              'w-4.5 h-4.5 mr-3 flex-shrink-0 transition-colors',
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
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

        {/* Sidebar Footer */}
        {user && (
          <div className="relative z-10 p-3 border-t border-white/5 bg-black/10">
            <div className="flex items-center justify-between bg-black/20 dark:bg-white/4 p-2.5 rounded-xl border border-white/5 dark:border-white/8 dark:hover:border-indigo-500/20 transition-colors">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 truncate font-semibold uppercase tracking-wider">
                    {getRoleLabel()}
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

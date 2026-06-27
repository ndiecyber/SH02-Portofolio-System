import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import lexaLogo from '../../assets/lexa.svg';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isDashboard = location.pathname === '/';

  // Generate dynamic breadcrumbs for other modules
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedValue = value
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());

          // Skip routing ID hashes to detail page
          if (value.startsWith('proj-') || value.startsWith('cs-') || (!isNaN(value) && isLast)) {
            return (
              <React.Fragment key={to}>
                <span>/</span>
                <span className="text-slate-800 truncate max-w-[120px]">Detail</span>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={to}>
              <span>/</span>
              {isLast ? (
                <span className="text-slate-800 truncate max-w-[120px]">
                  {formattedValue}
                </span>
              ) : (
                <Link to={to} className="hover:text-blue-600 transition-colors">
                  {formattedValue}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 sticky top-0 shadow-sm">
      {/* Left section: Hamburger (mobile) + Greeting / Breadcrumbs */}
      <div className="flex items-center space-x-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu className="w-5.5 h-5.5" />
        </button>

        {isDashboard ? (
          <div className="hidden sm:block text-left min-w-0">
            <h1 className="text-sm font-extrabold text-slate-800 flex items-center">
              Welcome back, {user?.name || 'Lexa Admin'}!
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 truncate">
              Kelola portofolio proyek dan tampilkan karya terbaik LEXA.
            </p>
          </div>
        ) : (
          <div className="hidden sm:block">{getBreadcrumbs()}</div>
        )}
      </div>

      {/* Right section: Search + Notifications + Profile dropdown + Brand logo text */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Mock Search (matches Figma layout search placeholder) */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search projects, clients..."
            className="bg-slate-100/80 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-48 focus:w-64 transition-all duration-300 font-semibold"
          />
        </div>

        {/* Mock Notifications bell */}
        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Vertical divider */}
        <div className="h-6 w-[1px] bg-slate-200" />

        {/* Brand Logo on Right matching figma layout */}
        <img src={lexaLogo} alt="LEXA Logo" className="h-9 object-contain" />

        {/* Compact User Menu for mobile support */}
        {user && (
          <div className="relative lg:hidden" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500/30"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 animate-fade-in text-left">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate font-semibold uppercase">{user.role}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 mr-2.5 text-slate-400" />
                  Account Settings
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (window.confirm('Are you sure you want to sign out?')) {
                      logout();
                    }
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:bg-rose-500/5 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/forms/LoginForm';
import lexaLogo from '../../assets/lexa.svg';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to home page immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (email, password, rememberMe) => {
    await login(email, password);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* LEFT COLUMN: Brand Panel (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Decorative glowing circles */}
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-sky-400/20 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/20 blur-[100px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center">
          <img src={lexaLogo} alt="LEXA Software House" className="h-20 object-contain brightness-0 invert" />
        </div>

        {/* Center Copy & Visual Mockups */}
        <div className="relative z-10 my-auto space-y-8 max-w-lg">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Manage Projects <br />
              <span className="text-sky-300">Efficiently</span>
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              LEXA Project Management System helps your team collaborate, monitor progress, and deliver projects successfully.
            </p>
          </div>

          {/* Interactive Mock Dashboard Panel */}
          <div className="space-y-4 pt-4">
            {/* Mock Card 1: Project Overview */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">Project Overview</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">+12% This Month</span>
              </div>
              <div className="h-20 flex items-end justify-between px-1 space-x-1.5">
                <div className="w-full bg-white/20 hover:bg-sky-400/40 transition-colors h-[30%] rounded-t-sm" />
                <div className="w-full bg-white/20 hover:bg-sky-400/40 transition-colors h-[45%] rounded-t-sm" />
                <div className="w-full bg-white/20 hover:bg-sky-400/40 transition-colors h-[35%] rounded-t-sm" />
                <div className="w-full bg-white/20 hover:bg-sky-400/40 transition-colors h-[60%] rounded-t-sm" />
                <div className="w-full bg-white/30 hover:bg-sky-400/50 transition-colors h-[80%] rounded-t-sm" />
                <div className="w-full bg-sky-400/70 h-[95%] rounded-t-sm shadow-md" />
              </div>
            </div>

            {/* Bottom Row Mockups */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tasks pie mockup */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide mb-2 block">Tasks</span>
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" stroke="currentColor" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-sky-300" strokeDasharray="75, 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-sky-200">75%</div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-300 font-semibold uppercase">Completed</p>
                    <p className="text-xs font-bold text-white">45 / 60</p>
                  </div>
                </div>
              </div>

              {/* Team Activity mockup */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-100 uppercase tracking-wide mb-2 block">Team Activity</span>
                <div className="flex -space-x-2 overflow-hidden py-1">
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-500 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="" />
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-500 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80" alt="" />
                  <img className="inline-block h-6 w-6 rounded-full ring-2 ring-indigo-500 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80" alt="" />
                  <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-indigo-500">+4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-400 font-medium">
          &copy; 2026 LEXA Software House. All rights reserved.
        </div>
      </div>

      {/* RIGHT COLUMN: Form Panel */}
      <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-between p-8 sm:p-12 md:p-20 bg-white">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center mb-8">
          <img src={lexaLogo} alt="LEXA Software House" className="h-8 object-contain" />
        </div>
        <div className="hidden lg:block" /> {/* spacer */}

        {/* Form Wrap */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome Back!
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Sign in to continue to your dashboard.
            </p>
          </div>

          <LoginForm onSubmitSuccess={handleLoginSubmit} />
        </div>

        {/* Mobile / General Footer Copyright */}
        <div className="text-center text-xs text-slate-400 font-medium mt-8 lg:hidden">
          &copy; 2026 LEXA Software House. All rights reserved.
        </div>
        <div className="hidden lg:block" /> {/* spacer */}
      </div>
    </div>
  );
};

export default LoginPage;

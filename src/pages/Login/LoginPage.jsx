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

  const handleLoginSubmit = async (email, password, _rememberMe) => {
    await login(email, password);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* LEFT COLUMN: Brand Panel (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] bg-gradient-to-br from-[#0a0f1d] via-[#101726] to-[#0f172a] text-white flex-col justify-between p-10 relative overflow-hidden border-r border-slate-800">
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Decorative glowing circles */}
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center">
          <img src={lexaLogo} alt="LEXA Software House" className="h-14 object-contain brightness-0 invert" />
        </div>

        {/* Center Copy & Visual Mockups */}
        <div className="relative z-10 my-auto space-y-5 max-w-md">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              LEXA Portfolio <br />
              <span className="text-brand-indigo">Management System</span>
            </h1>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold">
              Sistem manajemen internal dan visualisasi portfolio proyek multi-role untuk LEXA Software House.
            </p>
          </div>

          {/* Interactive Mock Dashboard Panel */}
          <div className="space-y-3 pt-2">
            {/* Mock Card 1: Project Overview */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-4 border border-slate-800 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Active Sprint Progress</span>
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">On Schedule</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>HR Core Platform</span>
                  <span>40%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-indigo h-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
          &copy; 2026 LEXA Software House.
        </div>
      </div>

      {/* RIGHT COLUMN: Form Panel */}
      <div className="w-full lg:w-[60%] xl:w-[55%] flex flex-col justify-center p-6 sm:p-12 md:px-20 bg-white overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center mb-8">
          <img src={lexaLogo} alt="LEXA Software House" className="h-8 object-contain" />
        </div>

        {/* Form Wrap */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Selamat Datang!
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Masuk untuk mengelola dashboard portfolio proyek.
            </p>
          </div>

          <LoginForm onSubmitSuccess={handleLoginSubmit} />
        </div>

        {/* Mobile Footer Copyright */}
        <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-8 lg:hidden">
          &copy; 2026 LEXA Software House.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

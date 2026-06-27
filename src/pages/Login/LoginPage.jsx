import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/forms/LoginForm';
import lexaLogo from '../../assets/lexa.svg';
import { KeyRound } from 'lucide-react';

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

  const handleQuickLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      alert('Gagal login cepat: ' + err.message);
    }
  };

  const testerAccounts = [
    { label: 'CEO / Admin', email: 'admin@lexa.com', pass: 'admin123', color: 'border-indigo-500 hover:bg-indigo-500/10' },
    { label: 'Proj. Manager', email: 'pm@lexa.com', pass: 'pm1234', color: 'border-blue-500 hover:bg-blue-500/10' },
    { label: 'Developer', email: 'dev@lexa.com', pass: 'dev1234', color: 'border-amber-500 hover:bg-amber-500/10' },
    { label: 'UI/UX Designer', email: 'designer@lexa.com', pass: 'design123', color: 'border-purple-500 hover:bg-purple-500/10' },
    { label: 'QA Tester', email: 'qa@lexa.com', pass: 'qa1234', color: 'border-rose-500 hover:bg-rose-500/10' },
    { label: 'Client', email: 'client@lexa.com', pass: 'client123', color: 'border-teal-500 hover:bg-teal-500/10' },
    { label: 'Intern T1 (Learn)', email: 'learning.intern@lexa.com', pass: 'intern123', color: 'border-slate-500 hover:bg-slate-550/10' },
    { label: 'Intern T2 (Appr)', email: 'apprentice.intern@lexa.com', pass: 'intern123', color: 'border-slate-500 hover:bg-slate-550/10' },
    { label: 'Intern T3 (Jr)', email: 'junior.intern@lexa.com', pass: 'intern123', color: 'border-slate-500 hover:bg-slate-550/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
      {/* LEFT COLUMN: Brand Panel (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] bg-gradient-to-br from-[#0a0f1d] via-[#101726] to-[#0f172a] text-white flex-col justify-between p-12 relative overflow-hidden border-r border-slate-800">
        {/* Subtle grid patterns */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Decorative glowing circles */}
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px]" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center">
          <img src={lexaLogo} alt="LEXA Software House" className="h-16 object-contain brightness-0 invert" />
        </div>

        {/* Center Copy & Visual Mockups */}
        <div className="relative z-10 my-auto space-y-6 max-w-md">
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
      <div className="w-full lg:w-[60%] xl:w-[55%] flex flex-col justify-between p-6 sm:p-12 md:px-20 bg-white overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center mb-6">
          <img src={lexaLogo} alt="LEXA Software House" className="h-8 object-contain" />
        </div>
        <div className="hidden lg:block" /> {/* spacer */}

        {/* Form Wrap */}
        <div className="w-full max-w-md mx-auto my-auto py-2 space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Selamat Datang!
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              Masuk untuk mengelola dashboard portfolio proyek.
            </p>
          </div>

          <LoginForm onSubmitSuccess={handleLoginSubmit} />

          {/* QUICK ROLE SWITCHER FOR EASY EVALUATION */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <KeyRound className="w-4.5 h-4.5 text-blue-600" />
              <span>Quick Role Switcher (Evaluator Shortcut)</span>
            </div>
            
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Klik salah satu akun penguji di bawah ini untuk langsung login ke peran role yang diinginkan tanpa mengetik kredensial.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {testerAccounts.map((acc) => (
                <button
                  type="button"
                  key={acc.label}
                  onClick={() => handleQuickLogin(acc.email, acc.pass)}
                  className={`py-2 px-1 text-[9px] font-bold text-slate-700 bg-white border rounded-lg transition-all active:scale-95 text-center ${acc.color}`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile / General Footer Copyright */}
        <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-6 lg:hidden">
          &copy; 2026 LEXA Software House.
        </div>
        <div className="hidden lg:block" /> {/* spacer */}
      </div>
    </div>
  );
};

export default LoginPage;

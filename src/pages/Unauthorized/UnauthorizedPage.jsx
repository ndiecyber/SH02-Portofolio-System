import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="glass-premium rounded-2xl p-10 max-w-lg w-full text-center space-y-6 animate-fade-in border border-red-500/20">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Akses Ditolak</h1>
          <p className="text-sm text-slate-500 leading-relaxed font-semibold">
            Maaf, akun Anda tidak memiliki hak akses yang memadai untuk melihat halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-650 border border-slate-200 font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Sebelumnya</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

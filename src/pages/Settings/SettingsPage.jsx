import React, { useState, useEffect } from 'react';
import * as settingsApi from '../../services/settingsApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Building, Shield, Save, Lock, X } from 'lucide-react';
import Swal from 'sweetalert2';

const SettingsPage = () => {
  const { isCEO, isPM, user } = useRole();

  const isCompanySettingsAllowed = isCEO;

  const [activeTab, setActiveTab] = useState(isCompanySettingsAllowed ? 'company' : 'security');
  const [loading, setLoading] = useState(isCompanySettingsAllowed);
  const [error, setError] = useState(null);
  
  // Company Settings Form State
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    logoUrl: ''
  });

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingCompany, setSavingCompany] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (isCompanySettingsAllowed) {
      const loadCompanySettings = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await settingsApi.getSettings();
          setCompanyForm({
            companyName: res.companyName || '',
            companyEmail: res.companyEmail || '',
            companyPhone: res.companyPhone || '',
            companyAddress: res.companyAddress || '',
            logoUrl: res.logoUrl || ''
          });
        } catch (err) {
          setError(err.message || 'Gagal memuat pengaturan.');
        } finally {
          setLoading(false);
        }
      };
      loadCompanySettings();
    }
  }, [isCompanySettingsAllowed]);

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!isCompanySettingsAllowed) return;

    setSavingCompany(true);
    try {
      await settingsApi.updateSettings(companyForm);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pengaturan perusahaan berhasil disimpan.',
        icon: 'success',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb'
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan pengaturan.', 'error');
    } finally {
      setSavingCompany(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire('Error', 'Kata sandi baru dan konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Swal.fire('Error', 'Kata sandi baru harus minimal 6 karakter.', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await settingsApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Kata sandi Anda berhasil diperbarui.',
        icon: 'success',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb'
      });

      // Clear password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      Swal.fire('Gagal', err.message || 'Gagal merubah kata sandi.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          {isCompanySettingsAllowed
            ? 'Kelola informasi instansi software house, logo branding, dan ganti kata sandi keamanan.'
            : 'Perbarui kata sandi akun Anda untuk meningkatkan keamanan.'}
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 gap-1.5">
        {isCompanySettingsAllowed && (
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'company'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-450 hover:text-slate-700'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Informasi Perusahaan</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Keamanan & Sandi</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader size="lg" />
          <p className="text-xs text-slate-400 font-semibold">Memuat pengaturan...</p>
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="glass rounded-2xl p-6 border border-slate-200 bg-white shadow-sm">
          
          {/* Tab 1: Company Settings */}
          {activeTab === 'company' && isCompanySettingsAllowed && (
            <form onSubmit={handleCompanySubmit} className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identitas & Kontak LEXA</h3>
              </div>

              {/* Logo preview and address */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5 border-b border-slate-100 pb-5">
                <img
                  src={companyForm.logoUrl}
                  alt="Company Logo"
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80';
                  }}
                />
                <Input
                  id="logoUrl"
                  label="Logo URL Image Address"
                  placeholder="Paste URL logo perusahaan di sini..."
                  variant="light"
                  value={companyForm.logoUrl}
                  onChange={(e) => setCompanyForm({ ...companyForm, logoUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="companyName"
                  label="Nama Perusahaan *"
                  placeholder="LEXA Software House"
                  variant="light"
                  value={companyForm.companyName}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                  required
                />
                <Input
                  id="companyEmail"
                  label="Email Resmi *"
                  placeholder="info@lexa.com"
                  variant="light"
                  type="email"
                  value={companyForm.companyEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyEmail: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="companyPhone"
                  label="No. Telepon / WhatsApp"
                  placeholder="+62 21 5555 1234"
                  variant="light"
                  value={companyForm.companyPhone}
                  onChange={(e) => setCompanyForm({ ...companyForm, companyPhone: e.target.value })}
                />
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alamat Perusahaan</label>
                  <textarea
                    rows={2}
                    placeholder="Alamat kantor pusat..."
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    value={companyForm.companyAddress}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyAddress: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end border-t border-slate-100 pt-4 mt-6">
                <Button
                  type="submit"
                  isLoading={savingCompany}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </Button>
              </div>
            </form>
          )}

          {/* Tab 2: Security settings */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Perbarui Kata Sandi</h3>
              </div>

              <div className="max-w-md space-y-4">
                <Input
                  id="currentPassword"
                  label="Kata Sandi Saat Ini *"
                  type="password"
                  placeholder="Masukkan kata sandi lama Anda..."
                  variant="light"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />

                <Input
                  id="newPassword"
                  label="Kata Sandi Baru *"
                  type="password"
                  placeholder="Kata sandi baru (min 6 karakter)..."
                  variant="light"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />

                <Input
                  id="confirmPassword"
                  label="Konfirmasi Kata Sandi Baru *"
                  type="password"
                  placeholder="Ketik ulang kata sandi baru..."
                  variant="light"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end border-t border-slate-100 pt-4 mt-6">
                <Button
                  type="submit"
                  isLoading={savingPassword}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Ganti Kata Sandi</span>
                </Button>
              </div>
            </form>
          )}

        </div>
      )}
    </div>
  );
};

export default SettingsPage;

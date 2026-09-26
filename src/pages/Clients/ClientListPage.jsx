import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as clientApi from '../../services/clientApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Globe,
  Mail,
  Phone,
  User,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';

const ClientListPage = () => {
  const navigate = useNavigate();
  const { isCEO, isPM, isDeveloper, canManageClients } = useRole();

  // Access checks: Admin and PM have full management; Developer can view
  const hasAccess = isCEO || isPM || isDeveloper;
  const canWrite = canManageClients;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    logo: '',
    active: true
  });

  useEffect(() => {
    if (!hasAccess && !loading) {
      navigate('/unauthorized');
    }
  }, [hasAccess, navigate, loading]);

  const loadClients = useCallback(async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError(null);
    try {
      const res = await clientApi.getClients({
        search,
        active: statusFilter === '' ? undefined : statusFilter === 'active'
      });
      setClients(res.clients || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar klien.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, hasAccess]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      company_name: '',
      industry: '',
      contact_name: '',
      email: '',
      phone: '',
      website: '',
      logo: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({
      company_name: client.company_name || client.name || '',
      industry: client.industry || '',
      contact_name: client.contact_name || '',
      email: client.email || '',
      phone: client.phone || '',
      website: client.website || '',
      logo: client.logo || '',
      active: client.active !== undefined ? client.active : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Nama Perusahaan/Klien wajib diisi.',
        icon: 'warning',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingClient) {
        await clientApi.updateClient(editingClient.id, formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data klien berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await clientApi.createClient(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Klien baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      setIsModalOpen(false);
      loadClients();
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Gagal menyimpan data klien.',
        icon: 'error',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id, companyName) => {
    Swal.fire({
      title: 'Hapus Klien',
      html: `Apakah Anda yakin ingin menghapus klien <b class="text-rose-400">${companyName}</b>? Tindakan ini tidak dapat dibatalkan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#f8fafc'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientApi.deleteClient(id);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Klien berhasil dihapus.',
            icon: 'success',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
          loadClients();
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.message || 'Gagal menghapus klien.',
            icon: 'error',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
        }
      }
    });
  };

  const activeCount = clients.filter((c) => c.active).length;
  const inactiveCount = clients.filter((c) => !c.active).length;

  if (!hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader size="md" />
        <p className="text-xs text-slate-400 font-semibold">Memeriksa hak akses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Manajemen Klien</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Kelola data mitra, perusahaan, dan relasi klien proyek LEXA Software House.
          </p>
        </div>

        {canWrite && (
          <Button
            onClick={handleOpenCreate}
            variant="primary"
            size="sm"
            className="flex items-center space-x-2 shadow-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Klien</span>
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm bg-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Klien</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm bg-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Klien Aktif</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-0.5">{activeCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm bg-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Non-Aktif / Arsip</p>
            <h3 className="text-2xl font-extrabold text-slate-500 mt-0.5">{inactiveCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perusahaan, kontak, industri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 focus:outline-none focus:border-blue-500 font-semibold w-full md:w-44"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif Saja</option>
            <option value="inactive">Non-Aktif Saja</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}
            className="flex items-center space-x-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass rounded-xl border border-slate-200 shadow-sm p-2 overflow-hidden bg-white">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil daftar klien...</p>
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert type="error" message={error} />
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                  <th className="py-3.5 px-4">Perusahaan / Klien</th>
                  <th className="py-3.5 px-4">Industri</th>
                  <th className="py-3.5 px-4">Kontak Person</th>
                  <th className="py-3.5 px-4">Kontak & Tautan</th>
                  <th className="py-3.5 px-4">Status</th>
                  {canWrite && <th className="py-3.5 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={canWrite ? 6 : 5} className="py-12 text-center text-slate-400 font-medium">
                      Tidak ada klien yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => {
                    const cName = client.company_name || client.name || 'Client';
                    return (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Company Name & Logo */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {client.logo ? (
                              <img
                                src={client.logo}
                                alt={cName}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-xs"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-xs">
                                {cName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {cName}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">ID: {client.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>

                        {/* Industry */}
                        <td className="py-4 px-4 text-slate-700 font-semibold">
                          {client.industry || <span className="text-slate-400 italic">-</span>}
                        </td>

                        {/* Contact Person */}
                        <td className="py-4 px-4 text-slate-700 font-semibold">
                          {client.contact_name ? (
                            <div className="flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{client.contact_name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>

                        {/* Contact & Website */}
                        <td className="py-4 px-4 space-y-1">
                          {client.email && (
                            <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          {client.website && (
                            <div className="flex items-center space-x-1.5 text-[11px]">
                              <Globe className="w-3 h-3 text-blue-500" />
                              <a
                                href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline flex items-center space-x-0.5 font-bold"
                              >
                                <span>Kunjungi</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                              client.active
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}
                          >
                            {client.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        {canWrite && (
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleOpenEdit(client)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Klien"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(client.id, cName)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Hapus Klien"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>{editingClient ? 'Ubah Data Klien' : 'Tambah Klien Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Perusahaan / Klien <span className="text-rose-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: PT Digital Nusantara"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sektor / Industri
                  </label>
                  <Input
                    placeholder="Contoh: FinTech, E-Commerce"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kontak Person (PIC)
                  </label>
                  <Input
                    placeholder="Contoh: Budi Santoso"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Kontak
                  </label>
                  <Input
                    type="email"
                    placeholder="client@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor Telepon
                  </label>
                  <Input
                    placeholder="+62 812..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <Input
                    placeholder="https://company.id"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Logo Image URL
                  </label>
                  <Input
                    placeholder="https://images.../logo.png"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="clientActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="clientActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Status Klien Aktif
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="font-bold text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="font-bold text-xs"
                >
                  {submitting ? 'Menyimpan...' : editingClient ? 'Simpan Perubahan' : 'Tambah Klien'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientListPage;

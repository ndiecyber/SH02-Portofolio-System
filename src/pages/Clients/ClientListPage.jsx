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
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Swal from 'sweetalert2';

const ClientListPage = () => {
  const navigate = useNavigate();
  const { isCEO } = useRole();

  // Clients module is admin-only on the backend.
  const hasAccess = isCEO;
  const canWrite = isCEO;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!hasAccess) {
      navigate('/unauthorized', { replace: true });
    }
  }, [hasAccess, navigate]);

  const loadClients = useCallback(async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError(null);
    try {
      const res = await clientApi.getClients({ search });
      setClients(res.clients || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar klien.');
    } finally {
      setLoading(false);
    }
  }, [search, hasAccess]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || client.company_name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({
        title: 'Validasi Gagal',
        text: 'Nama Perusahaan/Klien wajib diisi.',
        icon: 'warning',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb',
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
          confirmButtonColor: '#2563eb',
        });
      } else {
        await clientApi.createClient(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Klien baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb',
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
        confirmButtonColor: '#2563eb',
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
      color: '#f8fafc',
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
            confirmButtonColor: '#2563eb',
          });
          loadClients();
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.message || 'Gagal menghapus klien.',
            icon: 'error',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb',
          });
        }
      }
    });
  };

  if (!hasAccess) return null;

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
            Kelola data mitra dan perusahaan klien proyek LEXA Software House.
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

      {/* Filter and Search Bar */}
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama perusahaan atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500">Total: {total}</span>
          <button
            onClick={() => setSearch('')}
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
                  <th className="py-3.5 px-4">Kontak</th>
                  <th className="py-3.5 px-4">Alamat</th>
                  {canWrite && <th className="py-3.5 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={canWrite ? 4 : 3} className="py-12 text-center text-slate-400 font-medium">
                      Tidak ada klien yang sesuai dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => {
                    const cName = client.name || client.company_name || 'Client';
                    return (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Company Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-xs">
                              {cName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {cName}
                              </p>
                              <p className="text-[11px] text-slate-400 font-medium">ID: {String(client.id).slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
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
                          {!client.email && !client.phone && (
                            <span className="text-slate-400 italic">-</span>
                          )}
                        </td>

                        {/* Address */}
                        <td className="py-4 px-4 text-slate-700 font-semibold max-w-[260px]">
                          {client.address ? (
                            <div className="flex items-start space-x-1.5 text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                              <span>{client.address}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">-</span>
                          )}
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat
                </label>
                <textarea
                  rows={3}
                  placeholder="Alamat lengkap klien..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-semibold"
                />
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

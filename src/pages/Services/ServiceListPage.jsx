import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as serviceApi from '../../services/serviceApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Layers, CheckCircle2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const ServiceListPage = () => {
  const navigate = useNavigate();
  const { isCEO } = useRole();

  // Services module is admin-only on the backend.
  const hasAccess = isCEO;
  const canWrite = isCEO;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  // Filter States
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (!hasAccess) {
      navigate('/unauthorized', { replace: true });
    }
  }, [hasAccess, navigate]);

  const loadServices = useCallback(async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError(null);
    try {
      const res = await serviceApi.getServices({ search, limit: 100 });
      setServices(res.services || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar layanan.');
    } finally {
      setLoading(false);
    }
  }, [search, hasAccess]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      Swal.fire('Error', 'Nama layanan wajib diisi.', 'error');
      return;
    }

    try {
      if (editingService) {
        await serviceApi.updateService(editingService.id, formData);
        Swal.fire('Berhasil!', 'Layanan berhasil diperbarui.', 'success');
      } else {
        await serviceApi.createService(formData);
        Swal.fire('Berhasil!', 'Layanan baru berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      loadServices();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan layanan.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Hapus Layanan',
      html: `Apakah Anda yakin ingin menghapus layanan <b class="text-red-400">${name}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await serviceApi.deleteService(id);
          Swal.fire('Berhasil!', 'Layanan berhasil dihapus.', 'success');
          loadServices();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus layanan.', 'error');
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Layanan Perusahaan</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola spesialisasi keahlian dan katalog layanan profesional LEXA Software House.
          </p>
        </div>

        {canWrite && (
          <Button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Layanan Baru</span>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-end md:items-center gap-4 justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        <button
          onClick={() => setSearch('')}
          className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main List Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader size="lg" />
          <p className="text-xs text-slate-400 font-semibold">Mengambil daftar layanan...</p>
        </div>
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full py-16 bg-white border border-slate-200 rounded-xl text-center text-slate-400 font-bold text-xs shadow-sm">
              Tidak ada layanan yang ditemukan.
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="glass rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm bg-white hover:shadow-md transition-all duration-300 relative group">
                <div className="space-y-4">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-600 border border-blue-500/20">
                      <Layers className="w-6 h-6" />
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                      service.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}>
                      {service.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <h3 className="text-md font-extrabold text-slate-800 tracking-tight">{service.name}</h3>
                    <p className="text-xs text-slate-550 leading-relaxed font-semibold pt-1">
                      {service.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>
                </div>

                {/* Actions (Only for Admin/CEO) */}
                {canWrite && (
                  <div className="flex justify-end items-center gap-2 border-t border-slate-100 pt-4 mt-5">
                    <button
                      onClick={() => handleOpenEdit(service)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg border border-transparent transition-all font-bold"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id, service.name)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-transparent transition-all font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingService ? 'Ubah Informasi Layanan' : 'Tambah Layanan Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Lengkapi isian formulir di bawah ini.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="Nama Layanan *"
                placeholder="e.g. Web Development"
                variant="light"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi Layanan</label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan spesifikasi keahlian, tech stack pendukung, dan scope penawaran..."
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="serviceActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="serviceActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Layanan Aktif
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="bg-white hover:bg-slate-50 text-slate-650 border-slate-200 shadow-sm text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                >
                  {editingService ? 'Perbarui Layanan' : 'Simpan Layanan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;

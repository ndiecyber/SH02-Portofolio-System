import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as technologyApi from '../../services/technologyApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

const TechnologyListPage = () => {
  const navigate = useNavigate();
  const { isCEO, isPM, isDeveloper, isIntern } = useRole();

  // Access checks
  // Allowed: CEO, PM, Developer, Intern (Read-only for PM, Dev, Intern. CRUD for CEO/Admin)
  const hasAccess = isCEO || isPM || isDeveloper || isIntern;
  const canWrite = isCEO;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technologies, setTechnologies] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 'Intermediate',
    isActive: true
  });

  useEffect(() => {
    if (!hasAccess && !loading) {
      navigate('/unauthorized');
    }
  }, [hasAccess, navigate, loading]);

  const loadTechs = useCallback(async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError(null);
    try {
      const res = await technologyApi.getTechnologies({
        search,
        category: categoryFilter
      });
      setTechnologies(res);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar teknologi.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, hasAccess]);

  useEffect(() => {
    loadTechs();
  }, [loadTechs]);

  const handleOpenCreate = () => {
    setEditingTech(null);
    setFormData({
      name: '',
      category: 'Frontend',
      proficiency: 'Intermediate',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tech) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name || '',
      category: tech.category || 'Frontend',
      proficiency: tech.proficiency || 'Intermediate',
      isActive: tech.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      Swal.fire('Error', 'Nama teknologi wajib diisi.', 'error');
      return;
    }

    try {
      if (editingTech) {
        await technologyApi.updateTechnology(editingTech.id, formData);
        Swal.fire('Berhasil!', 'Teknologi berhasil diperbarui.', 'success');
      } else {
        await technologyApi.createTechnology(formData);
        Swal.fire('Berhasil!', 'Teknologi baru berhasil ditambahkan.', 'success');
      }
      setIsModalOpen(false);
      loadTechs();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan teknologi.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Hapus Teknologi',
      html: `Apakah Anda yakin ingin menghapus teknologi <b class="text-red-400">${name}</b>?`,
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
          await technologyApi.deleteTechnology(id);
          Swal.fire('Berhasil!', 'Teknologi berhasil dihapus.', 'success');
          loadTechs();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus teknologi.', 'error');
        }
      }
    });
  };

  const getProficiencyStyle = (prof) => {
    switch (prof) {
      case 'Advanced':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case 'Intermediate':
        return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-650 border border-slate-500/20';
    }
  };

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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Teknologi & Tools</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola katalog tech stack, keahlian tim, dan tools pengembangan proyek.
          </p>
        </div>

        {canWrite && (
          <Button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Teknologi Baru</span>
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
            placeholder="Cari nama teknologi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        {/* Filter Category */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex flex-col space-y-1 w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold w-full"
            >
              <option value="">Semua Kategori</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Mobile">Mobile</option>
              <option value="DevOps">DevOps</option>
              <option value="Database">Database</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); }}
            className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9"
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
            <p className="text-xs text-slate-400 font-semibold">Mengambil daftar teknologi...</p>
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
                  <th className="py-3.5 px-4">Nama Teknologi</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Tingkat Kemahiran</th>
                  <th className="py-3.5 px-4">Status</th>
                  {canWrite && <th className="py-3.5 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {technologies.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada teknologi yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  technologies.map((tech) => (
                    <tr key={tech.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4 font-bold text-slate-800 flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span>{tech.name}</span>
                      </td>

                      <td className="py-4 px-4 text-slate-550 font-bold">{tech.category}</td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${getProficiencyStyle(tech.proficiency)}`}>
                          {tech.proficiency}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          tech.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {tech.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {canWrite && (
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(tech)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tech.id, tech.name)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingTech ? 'Ubah Informasi Teknologi' : 'Tambah Teknologi Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Lengkapi data detail spesifikasi teknologi di bawah ini.
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
                label="Nama Teknologi *"
                placeholder="e.g. React Native, Docker, Go"
                variant="light"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Database">Database</option>
                    <option value="Design">Design</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                {/* Proficiency Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kemahiran Tim</label>
                  <select
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={formData.isActive ? "Active" : "Inactive"}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="bg-white hover:bg-slate-50 text-slate-650 border-slate-205 shadow-sm text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                >
                  {editingTech ? 'Perbarui Teknologi' : 'Simpan Teknologi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyListPage;

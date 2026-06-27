import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import ProjectTable from '../../components/tables/ProjectTable';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { Plus, Search, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { CATEGORIES, PROJECT_STATUS } from '../../config/constants';

const ProjectListPage = () => {
  const navigate = useNavigate();
  const { canCreateProject } = useRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        category,
        status,
        page,
        limit,
      };
      const res = await projectApi.getProjects(params);
      setProjects(res.projects);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar proyek.');
    } finally {
      setLoading(false);
    }
  }, [search, category, status, page]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Hapus Proyek',
      html: `Apakah Anda yakin ingin menghapus proyek <b class="text-red-400">${name}</b>? Tindakan ini juga akan menghapus case study yang terkait.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus Proyek',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626', // red-600
      cancelButtonColor: '#475569', // slate-600
      background: '#1e293b', // slate-800 matching popup theme
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-2xl border border-slate-700 shadow-xl',
        title: 'font-bold text-white',
        htmlContainer: 'text-slate-300 text-sm leading-relaxed',
        confirmButton: 'px-4 py-2 text-sm font-bold rounded-lg',
        cancelButton: 'px-4 py-2 text-sm font-bold rounded-lg',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await projectApi.deleteProject(id);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Proyek berhasil dihapus.',
            icon: 'success',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
          loadProjects();
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: err.message || 'Gagal menghapus proyek.',
            icon: 'error',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
        }
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Proyek</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola dan pantau seluruh daftar portfolio proyek LEXA Software House.
          </p>
        </div>

        {canCreateProject && (
          <Button
            onClick={() => navigate('/projects/new')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Proyek Baru</span>
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="glass rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-end md:items-center gap-4 justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Cari proyek atau klien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-350 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-slate-350 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1/2 focus:ring-blue-500 font-semibold"
            >
              <option value="">Semua Kategori</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white border border-slate-350 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1/2 focus:ring-blue-500 font-semibold"
            >
              <option value="">Semua Status</option>
              {Object.values(PROJECT_STATUS).map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all self-end h-9 mt-4 sm:mt-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="glass rounded-xl border border-slate-200 shadow-sm p-2 overflow-hidden bg-white">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil daftar proyek...</p>
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert type="error" message={error} />
          </div>
        ) : (
          <ProjectTable projects={projects} onDeleteClick={handleDelete} />
        )}
      </div>

      {/* Pagination Controls */}
      {total > limit && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs font-bold text-slate-500">
          <div>
            Menampilkan <span className="text-slate-800">{(page - 1) * limit + 1}</span> -{' '}
            <span className="text-slate-800">{Math.min(page * limit, total)}</span> dari{' '}
            <span className="text-slate-800">{total}</span> proyek
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            >
              Sebelumnya
            </button>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(page + 1)}
              className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-600 rounded-lg border border-slate-200 shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListPage;

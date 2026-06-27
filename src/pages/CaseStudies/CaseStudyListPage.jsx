import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as caseStudyApi from '../../services/caseStudyApi';
import { useRole } from '../../hooks/useRole';
import CaseStudyTable from '../../components/tables/CaseStudyTable';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { Plus, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';

const CaseStudyListPage = () => {
  const navigate = useNavigate();
  const { canManageCaseStudies } = useRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);

  // Filters State
  const [status, setStatus] = useState('');

  const loadCaseStudies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { status };
      const res = await caseStudyApi.getCaseStudies(params);
      setCaseStudies(res.caseStudies);
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar case studies.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadCaseStudies();
  }, [loadCaseStudies]);

  const handlePublishToggle = async (id, currentPublished) => {
    try {
      if (currentPublished) {
        await caseStudyApi.unpublishCaseStudy(id);
        Swal.fire({
          title: 'Drafting!',
          text: 'Case study telah dikembalikan ke Draft.',
          icon: 'info',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await caseStudyApi.publishCaseStudy(id);
        Swal.fire({
          title: 'Published!',
          text: 'Case study berhasil dipublikasikan ke publik.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      loadCaseStudies();
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Gagal memperbarui status publikasi.',
        icon: 'error',
        background: '#1e293b',
        color: '#f8fafc',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Hapus Case Study',
      html: `Apakah Anda yakin ingin menghapus case study <b class="text-red-400">${title}</b>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#1e293b',
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
          await caseStudyApi.deleteCaseStudy(id);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Case study berhasil dihapus.',
            icon: 'success',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
          loadCaseStudies();
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: err.message || 'Gagal menghapus case study.',
            icon: 'error',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Case Studies</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Susun analisis tantangan, solusi, dan hasil kerja proyek terbaik untuk dipublikasikan.
          </p>
        </div>

        {canManageCaseStudies() && (
          <Button
            onClick={() => navigate('/case-studies/new')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Case Study</span>
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="glass rounded-xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex flex-col space-y-1 w-full sm:w-48 text-left">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-slate-350 rounded-lg py-2 px-3 text-xs text-slate-855 focus:outline-none focus:border-blue-500 focus:ring-1/2 focus:ring-blue-500 font-semibold"
          >
            <option value="">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <button
          onClick={loadCaseStudies}
          className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all self-end h-9 font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Table Content */}
      <div className="glass rounded-xl border border-slate-200 shadow-sm p-2 overflow-hidden bg-white">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil daftar case studies...</p>
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert type="error" message={error} />
          </div>
        ) : (
          <CaseStudyTable
            caseStudies={caseStudies}
            onPublishToggle={handlePublishToggle}
            onDeleteClick={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default CaseStudyListPage;

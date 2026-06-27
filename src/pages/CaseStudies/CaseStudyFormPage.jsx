import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import * as caseStudyApi from '../../services/caseStudyApi';
import CaseStudyForm from '../../components/forms/CaseStudyForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';

const CaseStudyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManageCaseStudies } = useRole();

  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [caseStudyData, setCaseStudyData] = useState(null);

  useEffect(() => {
    // General access verification
    if (!canManageCaseStudies()) {
      navigate('/unauthorized');
      return;
    }

    if (isEditMode) {
      const fetchCaseStudy = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await caseStudyApi.getCaseStudy(id);
          setCaseStudyData(res);
        } catch (err) {
          setError(err.message || 'Gagal mengambil data case study.');
        } finally {
          setLoading(false);
        }
      };
      fetchCaseStudy();
    }
  }, [id, isEditMode, navigate, canManageCaseStudies]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await caseStudyApi.updateCaseStudy(id, formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Case study berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await caseStudyApi.createCaseStudy(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Case study baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      navigate('/case-studies');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader size="lg" />
        <p className="text-xs text-slate-400 font-semibold">Mengambil formulir case study...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb Header */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Link to="/case-studies" className="hover:text-blue-500">Case Studies</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{isEditMode ? 'Edit' : 'New'}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isEditMode ? 'Edit Case Study' : 'Tambah Case Study Baru'}
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">
          Tulis analisis mendalam tentang tantangan, langkah-langkah implementasi solusi, dan pencapaian metric proyek.
        </p>
      </div>

      {error ? (
        <div className="space-y-4">
          <Alert type="error" message={error} />
          <Link
            to="/case-studies"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Case Studies</span>
          </Link>
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-6 border border-slate-200 bg-white">
          <CaseStudyForm
            initialData={caseStudyData || {}}
            onSubmitSuccess={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default CaseStudyFormPage;

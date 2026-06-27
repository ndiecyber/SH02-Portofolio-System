import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import * as projectApi from '../../services/projectApi';
import ProjectForm from '../../components/forms/ProjectForm';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const ProjectFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canCreateProject, canEditProject, isCEO } = useRole();

  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        setLoading(true);
        setError(null);
        try {
          const project = await projectApi.getProject(id);
          
          // Verify if PM has assignment access
          if (!isCEO && !canEditProject(project)) {
            navigate('/unauthorized');
            return;
          }
          setProjectData(project);
        } catch (err) {
          setError(err.message || 'Gagal mengambil data proyek.');
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else {
      // Create mode checks
      if (!canCreateProject) {
        navigate('/unauthorized');
      }
    }
  }, [id, isEditMode, navigate, canCreateProject, canEditProject, isCEO]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await projectApi.updateProject(id, formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data proyek berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await projectApi.createProject(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Proyek baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      navigate('/projects');
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader size="lg" />
        <p className="text-xs text-slate-400 font-semibold">Mengambil informasi formulir...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Breadcrumb Header */}
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Link to="/projects" className="hover:text-blue-500">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400">{isEditMode ? 'Edit Project' : 'New Project'}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isEditMode ? 'Ubah Informasi Proyek' : 'Tambah Proyek Baru'}
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">
          {isEditMode ? 'Perbarui rincian scope, status, budget, atau penugasan anggota tim.' : 'Daftarkan portofolio proyek baru lengkap dengan timeline dan team roles.'}
        </p>
      </div>

      {error ? (
        <div className="space-y-4">
          <Alert type="error" message={error} />
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold font-sans shadow-sm transition-all active:scale-95"
          >
            Kembali ke Daftar Proyek
          </button>
        </div>
      ) : (
        <div className="glass-premium rounded-2xl p-6 border border-slate-200">
          <ProjectForm
            initialData={projectData || {}}
            onSubmitSuccess={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

// Internal router Link replacement mock
import { Link as RouterLink } from 'react-router-dom';
const Link = ({ children, to, ...props }) => (
  <RouterLink to={to} {...props}>{children}</RouterLink>
);

export default ProjectFormPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { ChevronRight, Calendar, DollarSign, Tag, Users, CheckCircle2, ArrowLeft, PenSquare, Share2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isProjectAssigned, canUpdateProgress, canEditProject } = useRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [allMembers, setAllMembers] = useState([]);

  // Developer panel state
  const [updating, setUpdating] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [progressNotesVal, setProgressNotesVal] = useState('');
  const [statusVal, setStatusVal] = useState('');

  const loadProjectData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const proj = await projectApi.getProject(id);
      
      // Access Guard: Ensure assigned
      if (!isProjectAssigned(proj)) {
        navigate('/unauthorized');
        return;
      }

      setProject(proj);
      setProgressVal(proj.progress);
      setProgressNotesVal(proj.progressNotes || '');
      setStatusVal(proj.status);

      // Load members details
      const members = JSON.parse(localStorage.getItem('sh02_db_team_members') || '[]');
      setAllMembers(members);
    } catch (err) {
      setError(err.message || 'Gagal memuat detail proyek.');
    } finally {
      setLoading(false);
    }
  }, [id, isProjectAssigned, navigate]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleProgressUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await projectApi.updateProjectProgress(project.id, {
        progress: progressVal,
        status: statusVal,
        progressNotes: progressNotesVal
      });

      Swal.fire({
        title: 'Sukses!',
        text: 'Progress proyek berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });

      // Reload project details
      const updatedProj = await projectApi.getProject(id);
      setProject(updatedProj);
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message || 'Gagal memperbarui progress.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'On Hold':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-650 border border-slate-500/20';
    }
  };

  const formatCurrency = (val) => {
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader size="lg" />
        <p className="text-xs text-slate-400 font-semibold">Mengambil informasi detail proyek...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4 text-left">
        <Alert type="error" message={error || 'Proyek tidak ditemukan.'} />
        <Button onClick={() => navigate('/projects')} variant="secondary" className="flex items-center space-x-2 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-bold shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Proyek</span>
        </Button>
      </div>
    );
  }

  // Get project assigned members details
  const teamDetails = allMembers.filter(m => project.teamMembers?.includes(m.id));

  return (
    <div className="space-y-6 text-left">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Link to="/projects" className="hover:text-blue-500">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">Detail</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{project.name}</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Klien: {project.clientName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/projects"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>

          <button
            onClick={() => {
              const code = project.trackingCode || project.id;
              const link = window.location.origin + '/track?code=' + code;
              navigator.clipboard.writeText(link);
              Swal.fire({
                title: 'Tautan Tracking Disalin!',
                html: `Tautan pelacakan proyek untuk klien berhasil disalin:<br/><b class="text-blue-500 text-xs">${link}</b>`,
                icon: 'success',
                confirmButtonColor: '#2563eb'
              });
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span>Salin Link Tracking</span>
          </button>
          
          {canEditProject(project) && (
            <Link
              to={`/projects/${project.id}/edit`}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 duration-200"
            >
              <PenSquare className="w-4 h-4" />
              <span>Edit Proyek</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Primary Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="glass rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-64 object-cover border-b border-slate-150"
            />
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  Kategori: <b className="text-slate-700">{project.category}</b>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${getStatusStyle(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Deskripsi Proyek</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                  {project.description}
                </p>
              </div>

              {/* Progress Summary */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                  <span>Persentase Kemajuan (Progress)</span>
                  <span className="text-slate-800 font-extrabold text-sm">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-150">
                  <div
                    className="bg-blue-600 rounded-full h-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                {project.progressNotes && (
                  <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 font-semibold mt-2.5">
                    <p className="text-[10px] text-slate-400 uppercase font-extrabold mb-1">Catatan Terakhir:</p>
                    "{project.progressNotes}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Details Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass rounded-xl p-4 border border-slate-200 flex items-center space-x-3 shadow-sm bg-white">
              <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600 border border-blue-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mulai</p>
                <p className="text-xs font-bold text-slate-800">{project.startDate}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-slate-200 flex items-center space-x-3 shadow-sm bg-white">
              <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-600 border border-rose-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Selesai</p>
                <p className="text-xs font-bold text-slate-800">{project.endDate}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4 border border-slate-200 flex items-center space-x-3 shadow-sm bg-white">
              <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-600 border border-emerald-500/20">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nilai Kontrak</p>
                <p className="text-xs font-bold text-slate-800">{formatCurrency(project.budget)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Team, Tech, & Developer Panel */}
        <div className="space-y-6">
          {/* Developer progress updates panel */}
          {canUpdateProgress(project) && (
            <div className="glass-premium rounded-2xl p-5 border border-blue-200 shadow-md bg-white space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                  Perbarui Progress Proyek
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Developer & Intern Progress Updater</p>
              </div>
              
              <form onSubmit={handleProgressUpdateSubmit} className="space-y-3 text-left">
                {/* Progress bar input slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <label htmlFor="progressRange">Persentase ({progressVal}%)</label>
                  </div>
                  <input
                    id="progressRange"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={progressVal}
                    onChange={(e) => setProgressVal(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Status selector */}
                <div className="space-y-1.5">
                  <label htmlFor="progressStatus" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Proyek</label>
                  <select
                    id="progressStatus"
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-350 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* Progress notes */}
                <div className="space-y-1.5">
                  <label htmlFor="progressNotes" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Catatan Kemajuan / Log Kerja</label>
                  <textarea
                    id="progressNotes"
                    rows={3}
                    value={progressNotesVal}
                    onChange={(e) => setProgressNotesVal(e.target.value)}
                    placeholder="Tulis implementasi sprint, checklist selesai, atau kendala..."
                    className="w-full bg-white text-slate-900 border border-slate-355 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={updating}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all"
                >
                  Simpan Kemajuan
                </Button>
              </form>
            </div>
          )}

          {/* Tech stack card */}
          <div className="glass rounded-xl p-5 border border-slate-200 space-y-3 bg-white">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
              <Tag className="w-4 h-4 mr-2 text-blue-600" />
              Teknologi Digunakan
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="bg-slate-50 border border-slate-200 text-slate-650 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors"
                >
                  {tech}
                </span>
              ))}
              {(!project.technologies || project.technologies.length === 0) && (
                <span className="text-xs text-slate-400 font-semibold">Tidak ada tag teknologi.</span>
              )}
            </div>
          </div>

          {/* Team Assigned card */}
          <div className="glass rounded-xl p-5 border border-slate-200 space-y-3 bg-white">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Anggota Tim Ditugaskan
            </h3>
            <div className="space-y-3">
              {teamDetails.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-extrabold text-slate-600 uppercase border border-slate-200 flex-shrink-0">
                    {member.name.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{member.role.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              ))}
              {teamDetails.length === 0 && (
                <p className="text-xs text-slate-400 font-semibold">Belum ada anggota tim yang ditugaskan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

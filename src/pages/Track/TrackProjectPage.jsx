import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as mockDb from '../../utils/mockDb';
import { Briefcase, Calendar, CheckSquare, Clock, Cpu, User, Users, ClipboardCopy, Search, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import lexaLogo from '../../assets/lexa.svg';

const TrackProjectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const urlCode = queryParams.get('code') || '';

  const [inputCode, setInputCode] = useState(urlCode);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mockDb.initMockDb();
    if (urlCode) {
      const allProjects = mockDb.dbGetProjects();
      // Find project where ID matches or custom trackingCode (if exists) matches
      const foundProject = allProjects.find(
        (p) => p.id.toLowerCase() === urlCode.toLowerCase() || (p.trackingCode && p.trackingCode.toLowerCase() === urlCode.toLowerCase())
      );

      if (foundProject) {
        setProject(foundProject);
        setSearchError(null);

        // Fetch related tasks
        const allTasks = mockDb.dbGetTasks();
        const projectTasks = allTasks.filter((t) => t.projectId === foundProject.id);
        setTasks(projectTasks);

        // Fetch resolved team member list
        const allTeam = mockDb.dbGetTeamMembers();
        const assignedTeam = allTeam.filter((m) => foundProject.teamMembers?.includes(m.id));
        setTeamMembers(assignedTeam);
      } else {
        setProject(null);
        setSearchError('Kode tracking tidak ditemukan. Pastikan kode yang dimasukkan benar.');
      }
    } else {
      setProject(null);
      setSearchError(null);
    }
  }, [urlCode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/track?code=${inputCode.trim()}`);
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'On Hold':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 shadow-sm z-30">
        <div className="flex items-center space-x-3">
          <img src={lexaLogo} alt="LEXA Logo" className="h-8 object-contain" />
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase hidden sm:inline-block">
            Project Tracking Portal
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Login Dashboard</span>
        </button>
      </header>

      {/* Main Content View */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto flex flex-col justify-center">
        {!project ? (
          /* Search Prompt Card */
          <div className="glass-premium rounded-2xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center max-w-md w-full mx-auto shadow-xl">
            <Briefcase className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Track Your Project</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Masukkan kode resi / ID proyek yang dikirimkan oleh tim LEXA untuk melacak kemajuan pengerjaan.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="e.g. LEXA-ECOM-101 or proj-1"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-850 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-center font-bold tracking-wider"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md">
                Lacak Progres Proyek
              </Button>
            </form>

            {searchError && (
              <div className="mt-4">
                <Alert type="error" message={searchError} />
              </div>
            )}
          </div>
        ) : (
          /* Project Progress Detail Page */
          <div className="space-y-6 animate-fade-in text-left">
            {/* Title Summary Card */}
            <div className="glass-premium rounded-2xl p-5 md:p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                      Code: {project.trackingCode || project.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {project.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">
                    Client: <span className="text-slate-800 dark:text-slate-300 font-bold">{project.client}</span>
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2">
                  <button
                    onClick={copyLinkToClipboard}
                    className="flex items-center space-x-1.5 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Link Disalin!' : 'Salin Tautan'}</span>
                  </button>
                  <button
                    onClick={() => navigate('/track')}
                    className="flex items-center space-x-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Lacak Lainnya</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar Info */}
              <div className="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-5 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-500">Penyelesaian Proyek</span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Description & Timeline Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Left Column: Scope & Notes */}
              <div className="md:col-span-2 space-y-5">
                <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Deskripsi Scope Proyek</h3>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                    {project.description}
                  </p>
                </div>

                {project.progressNotes && (
                  <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Catatan Perkembangan</h3>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold italic">
                      "{project.progressNotes}"
                    </p>
                  </div>
                )}

                {/* Tasks List Board */}
                <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2 text-blue-500" />
                    Daftar Milestone & Tasks ({tasks.length})
                  </h3>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {tasks.length === 0 ? (
                      <p className="text-slate-450 dark:text-slate-500 text-xs py-4 text-center">Belum ada tugas atau milestone yang ditambahkan.</p>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id} className="pt-2.5 flex items-start justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{task.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                              task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                              task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {task.status}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.dueDate}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Timelines, Team & Tech */}
              <div className="space-y-5">
                {/* Timeline */}
                <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Timeline Realisasi
                  </h3>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tanggal Mulai</span>
                      <span className="text-slate-700 dark:text-slate-350">{project.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Selesai</span>
                      <span className="text-slate-700 dark:text-slate-350">{project.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Team Assignment */}
                <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Anggota Tim Pengembang
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2.5 text-xs">
                        <div className="w-6.5 h-6.5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-extrabold text-blue-600 border border-blue-200">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{member.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold">{member.department}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="glass rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
                    <Cpu className="w-4 h-4 mr-2 text-blue-500" />
                    Teknologi Utama
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-1 px-2.5 rounded-lg text-[10px] font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrackProjectPage;

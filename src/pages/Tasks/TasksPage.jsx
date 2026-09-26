import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as taskApi from '../../services/taskApi';
import * as projectApi from '../../services/projectApi';
import * as teamApi from '../../services/teamApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const TasksPage = () => {
  const navigate = useNavigate();
  const { isClient, isCEO, isPM, user } = useRole();

  const canManageTasks = isCEO || isPM;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assigneeId: '',
    dueDate: '',
    priority: 'Medium',
    status: 'To Do'
  });

  useEffect(() => {
    if (isClient) {
      navigate('/unauthorized');
    }
  }, [isClient, navigate]);

  const loadData = useCallback(async () => {
    if (isClient) return;
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, projRes, memRes] = await Promise.all([
        taskApi.getTasks({
          projectId: projectFilter,
          search
        }),
        projectApi.getProjects(),
        teamApi.getTeamMembers()
      ]);

      setTasks(tasksRes);
      setProjects(projRes.projects || []);
      setMembers(memRes.members || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data papan tugas.');
    } finally {
      setLoading(false);
    }
  }, [projectFilter, search, isClient]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      assigneeId: members[0]?.id || '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'To Do'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      projectId: task.projectId || '',
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'Medium',
      status: task.status || 'To Do'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId || !formData.assigneeId) {
      Swal.fire('Error', 'Mohon isi semua bidang wajib.', 'error');
      return;
    }

    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tugas berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await taskApi.createTask(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Tugas baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan tugas.', 'error');
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Hapus Tugas',
      html: `Apakah Anda yakin ingin menghapus tugas <b class="text-red-400">${title}</b>?`,
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
          await taskApi.deleteTask(id);
          Swal.fire('Berhasil!', 'Tugas berhasil dihapus.', 'success');
          loadData();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus tugas.', 'error');
        }
      }
    });
  };

  const handleMoveTask = async (task, direction) => {
    const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statuses.length) {
      const nextStatus = statuses[nextIndex];
      try {
        await taskApi.updateTask(task.id, { ...task, status: nextStatus });
        loadData();
      } catch (err) {
        Swal.fire('Error', err.message || 'Gagal memperbarui status tugas.', 'error');
      }
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-550 border border-slate-500/20';
    }
  };

  const renderColumn = (colStatus, colTitle, colColor) => {
    const colTasks = tasks.filter(t => t.status === colStatus);

    return (
      <div className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 p-4 min-h-[480px] w-full shadow-sm">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${colColor}`} />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{colTitle}</h3>
          </div>
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
            {colTasks.length}
          </span>
        </div>

        {/* Task Cards Container */}
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[600px] scrollbar-thin">
          {colTasks.length === 0 ? (
            <div className="h-28 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-center p-4">
              <p className="text-[10px] text-slate-400 font-semibold">Belum ada tugas.</p>
            </div>
          ) : (
            colTasks.map(task => {
              const assignedProject = projects.find(p => p.id === task.projectId);
              const assignedMember = members.find(m => m.id === task.assigneeId);
              const isAssignee = user && assignedMember && assignedMember.email === user.email;

              return (
                <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col text-left space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 truncate max-w-[120px]">
                      {assignedProject ? assignedProject.name : 'Proyek Lain'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
                      {task.title}
                    </h4>
                    <p className="text-[10px] text-slate-450 font-medium leading-relaxed mt-1 line-clamp-3">
                      {task.description}
                    </p>
                  </div>

                  {/* Assignee & Due Date Row */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[9px] uppercase border border-slate-200 flex-shrink-0">
                        {assignedMember ? assignedMember.name.substring(0, 2) : '?'}
                      </div>
                      <span className="font-semibold truncate">
                        {assignedMember ? assignedMember.name : 'Belum Ditugaskan'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 font-semibold text-slate-400 flex-shrink-0">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>

                  {/* Quick Action Progression Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex space-x-1">
                      {/* Left arrow */}
                      {colStatus !== 'To Do' && (canManageTasks || isAssignee) && (
                        <button
                          onClick={() => handleMoveTask(task, -1)}
                          className="p-1 hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors"
                          title="Kembalikan status"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {/* Right arrow */}
                      {colStatus !== 'Done' && (canManageTasks || isAssignee) && (
                        <button
                          onClick={() => handleMoveTask(task, 1)}
                          className="p-1 hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors"
                          title="Majukan status"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {canManageTasks && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id, task.title)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Papan Tugas</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola, distribusikan, dan pantau progres pengerjaan task project.
          </p>
        </div>

        {canManageTasks && (
          <Button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Tugas Baru</span>
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
            placeholder="Cari tugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        {/* Project Selector Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex flex-col space-y-1 w-48 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terkait Proyek</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold w-full"
            >
              <option value="">Semua Proyek</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setSearch(''); setProjectFilter(''); }}
            className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader size="lg" />
          <p className="text-xs text-slate-400 font-semibold">Mengambil data papan tugas...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Alert type="error" message={error} />
        </div>
      ) : (
        /* Kanban Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {renderColumn('To Do', 'To Do', 'bg-slate-400')}
          {renderColumn('In Progress', 'In Progress', 'bg-blue-500')}
          {renderColumn('In Review', 'In Review', 'bg-amber-500')}
          {renderColumn('Done', 'Selesai (Done)', 'bg-emerald-500')}
        </div>
      )}

      {/* CRUD Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingTask ? 'Ubah Informasi Tugas' : 'Tambah Tugas Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Lengkapi data detail tugas di bawah ini.
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
                id="title"
                label="Judul Tugas *"
                placeholder="e.g. Desain Dashboard User Interface"
                variant="light"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi Tugas</label>
                <textarea
                  rows={3}
                  placeholder="Detail mengenai instruksi task..."
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Project Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terkait Proyek *</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Assignee Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ditugaskan Kepada *</label>
                  <select
                    value={formData.assigneeId}
                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    required
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Due Date */}
                <Input
                  id="dueDate"
                  label="Jatuh Tempo *"
                  type="date"
                  variant="light"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />

                {/* Priority Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Prioritas</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Status Selector */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="secondary"
                  className="bg-white hover:bg-slate-50 text-slate-655 border-slate-200 shadow-sm text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                >
                  {editingTask ? 'Perbarui Tugas' : 'Simpan Tugas'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

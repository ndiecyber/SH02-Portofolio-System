import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../../services/userApi';
import * as teamApi from '../../services/teamApi';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Shield, Key, Mail, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { ROLES, MAGANG_TIERS } from '../../config/constants';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { isCEO, role: currentUserRole } = useRole();

  // Redirect if not CEO/Admin
  useEffect(() => {
    if (!isCEO) {
      navigate('/unauthorized');
    }
  }, [isCEO, navigate]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DEVELOPER',
    team_id: '',
    magang_tier: 'LEARNING',
    status: 'Active',
    assignedProjects: []
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, teamsRes, projectsRes] = await Promise.all([
        userApi.getUsers({ search, role: roleFilter, status: statusFilter }),
        teamApi.getTeams(),
        projectApi.getProjects()
      ]);
      setUsers(usersRes.users);
      setTeams(teamsRes);
      setProjects(projectsRes.projects);
    } catch (err) {
      setError(err.message || 'Gagal memuat data manajemen user.');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (isCEO) {
      loadData();
    }
  }, [loadData, isCEO]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'DEVELOPER',
      team_id: '',
      magang_tier: 'LEARNING',
      status: 'Active',
      assignedProjects: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '', // Kept empty, only updated if filled
      role: user.role || 'DEVELOPER',
      team_id: user.team_id || '',
      magang_tier: user.magang_tier || 'LEARNING',
      status: user.status || 'Active',
      assignedProjects: user.assignedProjects || []
    });
    setIsModalOpen(true);
  };

  const handleProjectToggle = (projectId) => {
    const isAssigned = formData.assignedProjects.includes(projectId);
    if (isAssigned) {
      setFormData(prev => ({
        ...prev,
        assignedProjects: prev.assignedProjects.filter(id => id !== projectId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignedProjects: [...prev.assignedProjects, projectId]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      Swal.fire('Error', 'Nama dan Email wajib diisi.', 'error');
      return;
    }
    if (!editingUser && !formData.password) {
      Swal.fire('Error', 'Password wajib diisi untuk user baru.', 'error');
      return;
    }

    const payload = {
      ...formData,
      // Clear password if empty in edit mode (don't overwrite original)
      ...(editingUser && !formData.password ? { password: editingUser.password } : {}),
      // Clean up intern fields if not intern
      magang_tier: formData.role === ROLES.INTERN ? formData.magang_tier : null,
      team_id: [ROLES.CEO, ROLES.ADMIN, ROLES.CLIENT].includes(formData.role) ? null : formData.team_id || null
    };

    try {
      if (editingUser) {
        await userApi.updateUser(editingUser.id, payload);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Akun user berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await userApi.createUser(payload);
        Swal.fire({
          title: 'Berhasil!',
          text: 'User baru berhasil dibuat.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan data user.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Hapus User Account',
      html: `Apakah Anda yakin ingin menghapus akun <b class="text-red-400">${name}</b>? User tidak akan bisa login lagi ke sistem.`,
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
          await userApi.deleteUser(id);
          Swal.fire('Berhasil!', 'Akun user berhasil dihapus.', 'success');
          loadData();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus user.', 'error');
        }
      }
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case ROLES.CEO:
        return 'bg-red-500/10 text-red-600 border border-red-500/20';
      case ROLES.ADMIN:
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case ROLES.PROJECT_MANAGER:
        return 'bg-purple-500/10 text-purple-600 border border-purple-500/20';
      case ROLES.DEVELOPER:
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      case ROLES.CLIENT:
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case ROLES.INTERN:
        return 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case ROLES.CEO: return 'CEO';
      case ROLES.ADMIN: return 'Admin';
      case ROLES.PROJECT_MANAGER: return 'Project Manager';
      case ROLES.DEVELOPER: return 'Developer';
      case ROLES.UIUX_DESIGNER: return 'UI/UX Designer';
      case ROLES.QA_TESTER: return 'QA Tester';
      case ROLES.CLIENT: return 'Client';
      case ROLES.INTERN: return 'Internship';
      default: return role;
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setRoleFilter('');
    setStatusFilter('');
  };

  if (!isCEO) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen User</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola hak login akun, ganti password, atur peran otorisasi, dan aktivasi akun personil.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Buat User Baru</span>
        </Button>
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
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Peran (Role)</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold"
            >
              <option value="">Semua Peran</option>
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>{getRoleLabel(r)}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-855 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold"
            >
              <option value="">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9 mt-4 sm:mt-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass rounded-xl border border-slate-200 shadow-sm p-2 overflow-hidden bg-white">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil data user...</p>
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
                  <th className="py-3.5 px-4">Nama & Email</th>
                  <th className="py-3.5 px-4">Role System</th>
                  <th className="py-3.5 px-4">Team</th>
                  <th className="py-3.5 px-4">Progresi Magang</th>
                  <th className="py-3.5 px-4">Status Akun</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada user yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const assignedTeam = teams.find(t => t.id === u.team_id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="py-4 px-4 max-w-[220px]">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-slate-800 font-bold truncate">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeClass(u.role)}`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-550 font-bold">
                          {assignedTeam ? (
                            <span className="text-blue-650 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              {assignedTeam.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {u.role === ROLES.INTERN ? (
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">
                              Tier {u.magang_tier === 'LEARNING' ? '1: Learning' : u.magang_tier === 'APPRENTICE' ? '2: Apprentice' : '3: Junior'}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">-</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                            u.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(u)}
                              title="Edit User"
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              disabled={u.id === 'user-ceo'}
                              onClick={() => handleDelete(u.id, u.name)}
                              title={u.id === 'user-ceo' ? 'Cannot delete CEO account' : 'Delete User'}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all disabled:opacity-40 disabled:pointer-events-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingUser ? 'Ubah Akun User' : 'Buat Akun User Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Lengkapi isian formulir di bawah ini untuk hak otorisasi login.
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
              {/* Basic Section */}
              <div className="border-l-4 border-blue-600 pl-3">
                <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Kredensial Login</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="name"
                  label="Nama Lengkap *"
                  placeholder="e.g. Yogi Nugraha"
                  variant="light"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  id="email"
                  label="Alamat Email (Username) *"
                  type="email"
                  placeholder="e.g. admin@lexa.com"
                  variant="light"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    id="password"
                    label={editingUser ? "Ganti Password (Kosongkan jika tidak diubah)" : "Password Baru *"}
                    type="password"
                    placeholder="Minimal 6 karakter..."
                    variant="light"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                
                {/* Status Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Keaktifan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    disabled={editingUser?.id === 'user-ceo'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Roles Section */}
              <div className="border-l-4 border-blue-600 pl-3 pt-2">
                <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Otoritas & Hak Akses</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Role select */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    disabled={editingUser?.id === 'user-ceo'}
                  >
                    {Object.values(ROLES).map((r) => (
                      <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                  </select>
                </div>

                {/* Team Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Struktur Tim</label>
                  <select
                    value={formData.team_id}
                    onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    disabled={[ROLES.CEO, ROLES.ADMIN, ROLES.CLIENT].includes(formData.role)}
                  >
                    <option value="">Belum Memiliki Tim</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Intern progression */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Magang Tier</label>
                  <select
                    value={formData.magang_tier}
                    onChange={(e) => setFormData({ ...formData, magang_tier: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    disabled={formData.role !== ROLES.INTERN}
                  >
                    <option value={MAGANG_TIERS.LEARNING}>Tier 1: Learning</option>
                    <option value={MAGANG_TIERS.APPRENTICE}>Tier 2: Apprentice</option>
                    <option value={MAGANG_TIERS.JUNIOR}>Tier 3: Junior</option>
                  </select>
                </div>
              </div>

              {/* Projects Assignment Checklist */}
              <div className="space-y-1 text-left pt-2 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tugaskan Proyek (Scope Proyek)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                  {projects.map((proj) => {
                    const isChecked = formData.assignedProjects.includes(proj.id);
                    return (
                      <button
                        type="button"
                        key={proj.id}
                        onClick={() => handleProjectToggle(proj.id)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                          isChecked
                            ? 'bg-white border-blue-500/50 text-slate-800'
                            : 'bg-white border-slate-205 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-[10px] font-bold text-slate-850 truncate">{proj.name}</p>
                          <p className="text-[8px] text-slate-400 font-semibold">Client: {proj.client}</p>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-350'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 border-t border-slate-105 pt-4 mt-6">
                <Button
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
                  {editingUser ? 'Perbarui User' : 'Buat Akun'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../../services/userApi';
import * as teamApi from '../../services/teamApi';
import * as departmentApi from '../../services/departmentApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, UserCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin / Management' },
  { value: 'developer', label: 'Developer' }
];

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { isCEO } = useRole();

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
  const [departments, setDepartments] = useState([]);

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
    role: 'developer',
    departmentId: '',
    teamId: '',
    isActive: true
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, teamsRes, deptsRes] = await Promise.all([
        userApi.getUsers({ limit: 100 }),
        teamApi.getTeams().catch(() => []),
        departmentApi.getDepartments({ limit: 100 }).catch(() => ({ departments: [] }))
      ]);

      const q = search.trim().toLowerCase();
      const filtered = (usersRes.users || []).filter((u) => {
        const matchSearch =
          !q ||
          (u.name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q);
        const matchRole = !roleFilter || u.role === roleFilter;
        const matchStatus =
          statusFilter === ''
            ? true
            : statusFilter === 'Active'
            ? u.isActive
            : !u.isActive;
        return matchSearch && matchRole && matchStatus;
      });

      setUsers(filtered);
      setTeams(Array.isArray(teamsRes) ? teamsRes : teamsRes?.data || []);
      setDepartments(deptsRes.departments || []);
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
      role: 'developer',
      departmentId: departments[0]?.id || '',
      teamId: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'developer',
      departmentId: user.departmentId || '',
      teamId: user.teams?.[0]?.id || '',
      isActive: user.isActive !== false
    });
    setIsModalOpen(true);
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

    const base = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      departmentId: formData.departmentId || undefined,
      teamIds: formData.teamId ? [formData.teamId] : [],
      isActive: formData.isActive
    };

    try {
      if (editingUser) {
        await userApi.updateUser(editingUser.id, base);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Akun user berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        await userApi.createUser({ ...base, password: formData.password });
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
    switch ((role || '').toLowerCase()) {
      case 'admin':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'developer':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const getRoleLabel = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'admin': return 'Admin / Management';
      case 'developer': return 'Developer';
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
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
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
                  <th className="py-3.5 px-4">Departemen</th>
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
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-4 max-w-[220px]">
                        <div className="flex items-center space-x-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <UserCircle2 className="w-5 h-5" />
                            </div>
                          )}
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
                        {u.teams && u.teams.length > 0 ? (
                          <span className="text-blue-650 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {u.teams.map((t) => t.name).join(', ')}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">-</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-550 font-bold">
                        {u.department?.name || <span className="text-slate-400 font-medium">-</span>}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                          u.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        }`}>
                          {u.isActive ? 'Active' : 'Inactive'}
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
                            onClick={() => handleDelete(u.id, u.name)}
                            title="Delete User"
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
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
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="password"
                  label={editingUser ? "Ganti Password (Kosongkan jika tidak diubah)" : "Password Baru *"}
                  type="password"
                  placeholder="Minimal 8 karakter..."
                  variant="light"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />

                {/* Status Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Keaktifan</label>
                  <select
                    value={formData.isActive ? "Active" : "Inactive"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'Active' })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
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
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Department Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Departemen</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="">Pilih Departemen</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Team Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Struktur Tim</label>
                  <select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="">Belum Memiliki Tim</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
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

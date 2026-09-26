import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as departmentApi from '../../services/departmentApi';
import * as userApi from '../../services/userApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Building, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const DepartmentListPage = () => {
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
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Active'
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, usersRes] = await Promise.all([
        departmentApi.getDepartments({ search, status: statusFilter }),
        userApi.getUsers()
      ]);
      setDepartments(deptRes.departments);
      setUsers(usersRes.users || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data departemen.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (isCEO) {
      loadData();
    }
  }, [loadData, isCEO]);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      status: dept.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      Swal.fire('Error', 'Nama dan Kode Departemen wajib diisi.', 'error');
      return;
    }

    try {
      if (editingDept) {
        await departmentApi.updateDepartment(editingDept.id, formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data departemen berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      } else {
        // Check duplicate code
        const duplicates = departments.filter(d => d.code.toLowerCase() === formData.code.toLowerCase());
        if (duplicates.length > 0) {
          Swal.fire('Error', 'Kode departemen sudah digunakan.', 'error');
          return;
        }
        await departmentApi.createDepartment(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Departemen baru berhasil ditambahkan.',
          icon: 'success',
          background: '#1e293b',
          color: '#f8fafc',
          confirmButtonColor: '#2563eb'
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan data departemen.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    const assignedUsers = users.filter(u => u.department === name);
    const assignedCount = assignedUsers.length;

    let warningText = `Apakah Anda yakin ingin menghapus departemen <b class="text-red-400">${name}</b>?`;
    if (assignedCount > 0) {
      warningText += `<br/><br/><div class="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 p-2.5 rounded-lg text-left">
        <b>Peringatan:</b> Terdapat <b>${assignedCount} user</b> yang terhubung ke departemen ini.
        Jika Anda menghapusnya, departemen pada akun-akun tersebut akan <b>dikosongkan (unassigned)</b>.
      </div>`;
    }

    Swal.fire({
      title: 'Hapus Departemen',
      html: warningText,
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
          await departmentApi.deleteDepartment(id);
          Swal.fire({
            title: 'Berhasil!',
            text: 'Departemen berhasil dihapus.',
            icon: 'success',
            background: '#1e293b',
            color: '#f8fafc',
            confirmButtonColor: '#2563eb'
          });
          loadData();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus departemen.', 'error');
        }
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  const getMemberCount = (deptName) => {
    return users.filter(u => u.department === deptName && u.status === 'Active').length;
  };

  if (!isCEO) return null;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-7 h-7 text-blue-600" />
            Manajemen Departemen
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola data struktur organisasi departemen perusahaan, kode departemen, dan deskripsi tugas.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Departemen</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau kode departemen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1 text-left min-w-[140px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 border border-slate-250 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1"
            >
              <option value="">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {(search || statusFilter) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1.5 py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <div className="h-60 flex items-center justify-center">
          <Loader />
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Tidak Ada Departemen</h3>
          <p className="text-xs text-slate-450 mt-1 max-w-sm mx-auto">
            Belum ada departemen yang sesuai dengan filter pencarian Anda atau database masih kosong.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kode</th>
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Nama Departemen</th>
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Anggota Aktif</th>
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-800">{dept.name}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {dept.description || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-700 font-bold">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{getMemberCount(dept.name)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          dept.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                      >
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(dept)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id, dept.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Overlay */}
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" />

          {/* Modal Container */}
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-300 scale-100 z-10 flex flex-col text-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 bg-slate-50 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-850 tracking-wide uppercase">
                  {editingDept ? 'Edit Departemen' : 'Tambah Departemen'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-200/50 transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left overflow-y-auto">
              <div className="space-y-4">
                {/* Department Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nama Departemen *</label>
                  <Input
                    type="text"
                    placeholder="Contoh: Engineering, Back End"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Department Code */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kode Departemen *</label>
                  <Input
                    type="text"
                    placeholder="Contoh: ENG, BE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deskripsi Tugas</label>
                  <textarea
                    placeholder="Tuliskan cakupan tugas, wewenang, dan peran departemen di tim kerja ini."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 resize-none leading-relaxed"
                    rows={4}
                  />
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Operasional *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 text-slate-800 border border-slate-250 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {editingDept ? 'Simpan Perubahan' : 'Tambah Departemen'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentListPage;

import React, { useState, useEffect, useCallback } from 'react';
import * as teamApi from '../../services/teamApi';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import {
  Plus, Search, RefreshCw, Edit, Trash2, X,
  Users, Briefcase, UserMinus, UserPlus,
  Shield, Code, User
} from 'lucide-react';
import Swal from 'sweetalert2';
import * as departmentApi from '../../services/departmentApi';
import { ROLES } from '../../config/constants';

// ── Role Display helpers ──────────────────────────────────────────
const getRoleLabel = (role) => {
  const map = {
    ADMIN: 'Admin / Management',
    DEVELOPER: 'Developer'
  };
  return map[role] || role;
};

const getRoleIcon = (role) => {
  const map = {
    ADMIN: <Shield className="w-3 h-3" />,
    DEVELOPER: <Code className="w-3 h-3" />
  };
  return map[role] || <User className="w-3 h-3" />;
};

const getRoleBadge = (role) => {
  const map = {
    ADMIN: 'bg-amber-50 text-amber-700 border-amber-200',
    DEVELOPER: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  return map[role] || 'bg-slate-50 text-slate-600 border-slate-200';
};

const getInitials = (name) => name?.substring(0, 2).toUpperCase() || '??';

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-teal-500'
];

const getAvatarColor = (id) => {
  const idx = (id?.charCodeAt(id.length - 1) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

// ═════════════════════════════════════════════════════════════════
const TeamListPage = () => {
  const { isCEO } = useRole();

  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'directory'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  // ── Directory filter ──────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // ── Team detail modal ─────────────────────────────────────────
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetailMode, setTeamDetailMode] = useState('view'); // 'view' | 'add_member' | 'edit_member'
  const [editingMemberId, setEditingMemberId] = useState(null); // member id being edited
  const [memberJobInput, setMemberJobInput] = useState(''); // job description input
  const [addMemberSearch, setAddMemberSearch] = useState('');

  // ── Team name CRUD modal ──────────────────────────────────────
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamFormData, setTeamFormData] = useState({ name: '' });

  // ── Load data ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [membersRes, teamsRes, projectsRes, deptsRes] = await Promise.all([
        teamApi.getTeamMembers({ search, role: roleFilter, department: deptFilter }),
        teamApi.getTeams(),
        projectApi.getProjects(),
        departmentApi.getDepartments({ status: 'Active' })
      ]);
      setMembers(membersRes.members);
      setTeams(teamsRes);
      setProjects(projectsRes.projects);
      setDepartments(deptsRes.departments);
    } catch (err) {
      setError(err.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, deptFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  // Refresh selected team after data reload
  useEffect(() => {
    if (selectedTeam) {
      const refreshed = teams.find(t => t.id === selectedTeam.id);
      if (refreshed && refreshed !== selectedTeam) {
        setSelectedTeam(refreshed);
      }
    }
  }, [teams, selectedTeam]);

  // ── All members (no filter) for team modal lookups ────────────
  const [allMembers, setAllMembers] = useState([]);
  useEffect(() => {
    teamApi.getTeamMembers({}).then(r => setAllMembers(r.members)).catch(() => {});
  }, [loading]);

  // ── Team CRUD handlers ────────────────────────────────────────
  const handleOpenCreateTeam = () => {
    setEditingTeam(null);
    setTeamFormData({ name: '' });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeam = (team, e) => {
    e.stopPropagation();
    setEditingTeam(team);
    setTeamFormData({ name: team.name });
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamFormData.name.trim()) {
      Swal.fire('Error', 'Nama tim wajib diisi.', 'error');
      return;
    }
    try {
      if (editingTeam) {
        await teamApi.updateTeam(editingTeam.id, teamFormData);
        Swal.fire({ title: 'Berhasil!', text: 'Tim diperbarui.', icon: 'success', background: '#1e293b', color: '#f8fafc', confirmButtonColor: '#2563eb', timer: 1500, showConfirmButton: false });
      } else {
        await teamApi.createTeam(teamFormData);
        Swal.fire({ title: 'Berhasil!', text: 'Tim baru dibuat.', icon: 'success', background: '#1e293b', color: '#f8fafc', confirmButtonColor: '#2563eb', timer: 1500, showConfirmButton: false });
      }
      setIsTeamModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan tim.', 'error');
    }
  };

  const handleDeleteTeam = (team, e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Hapus Tim',
      html: `Hapus <b>${team.name}</b>? Anggota tim tidak akan dihapus, hanya penugasan timnya yang akan dikosongkan.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Ya, Hapus', cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626', cancelButtonColor: '#475569',
      background: '#1e293b', color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await teamApi.deleteTeam(team.id);
        // Unassign all members from this team
        const teamMembers = allMembers.filter(m => m.team_id === team.id);
        await Promise.all(teamMembers.map(m => teamApi.updateTeamMember(m.id, { ...m, team_id: null, jobDescription: null })));
        loadData();
      }
    });
  };

  // ── Team Detail: Member management ───────────────────────────
  const openTeamDetail = (team) => {
    setSelectedTeam(team);
    setTeamDetailMode('view');
    setEditingMemberId(null);
    setAddMemberSearch('');
    setMemberJobInput('');
  };

  const closeTeamDetail = () => {
    setSelectedTeam(null);
    setTeamDetailMode('view');
  };

  const teamMembersOf = (teamId) => allMembers.filter(m => m.team_id === teamId);

  const availableToAdd = (teamId) =>
    allMembers.filter(m => m.team_id !== teamId && m.role !== 'CLIENT')
      .filter(m => addMemberSearch === '' || m.name.toLowerCase().includes(addMemberSearch.toLowerCase()));

  const handleAddMemberToTeam = async (member) => {
    try {
      await teamApi.updateTeamMember(member.id, { ...member, team_id: selectedTeam.id });
      Swal.fire({ title: 'Ditambahkan!', text: `${member.name} bergabung ke ${selectedTeam.name}.`, icon: 'success', background: '#1e293b', color: '#f8fafc', timer: 1200, showConfirmButton: false });
      setAddMemberSearch('');
      await loadData();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleRemoveMemberFromTeam = (member) => {
    Swal.fire({
      title: 'Keluarkan Anggota',
      html: `Keluarkan <b>${member.name}</b> dari <b>${selectedTeam.name}</b>?`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Ya, Keluarkan', cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626', cancelButtonColor: '#475569',
      background: '#1e293b', color: '#f8fafc',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await teamApi.updateTeamMember(member.id, { ...member, team_id: null, jobDescription: null });
        await loadData();
      }
    });
  };

  const handleEditJobDesc = (member) => {
    setEditingMemberId(member.id);
    setMemberJobInput(member.jobDescription || '');
  };

  const handleSaveJobDesc = async (member) => {
    try {
      await teamApi.updateTeamMember(member.id, { ...member, jobDescription: memberJobInput });
      setEditingMemberId(null);
      await loadData();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  // ── Derived stats ─────────────────────────────────────────────
  const getTeamStats = (teamId) => {
    const mems = allMembers.filter(m => m.team_id === teamId);
    const projs = projects.filter(p => p.teamId === teamId || p.teamId === (teams.find(t => t.id === teamId)?.name));
    return { memberCount: mems.length, projectCount: projs.length };
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Tim</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola struktur tim, komposisi anggota, dan job description setiap personel.
          </p>
        </div>
        {isCEO && activeTab === 'teams' && (
          <Button
            onClick={handleOpenCreateTeam}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tim Baru</span>
          </Button>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 gap-1.5">
        {[
          { id: 'teams',     label: 'Daftar Tim & Anggota', icon: <Users className="w-4 h-4" /> },
          { id: 'directory', label: 'Direktori Personel',   icon: <Briefcase className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-450 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader size="lg" />
          <p className="text-xs text-slate-400 font-semibold">Mengambil data tim...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Alert type="error" message={error} />
        </div>
      ) : (
        <>
          {/* ════════════════════════════════════════════════════════
              TAB: DAFTAR TIM & ANGGOTA
          ════════════════════════════════════════════════════════ */}
          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {teams.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-400">Belum ada tim yang dibuat.</p>
                  {isCEO && (
                    <Button onClick={handleOpenCreateTeam} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                      <Plus className="w-4 h-4 mr-1.5" /> Buat Tim Pertama
                    </Button>
                  )}
                </div>
              ) : (
                teams.map(team => {
                  const stats = getTeamStats(team.id);
                  const teamMems = teamMembersOf(team.id);
                  const teamProjs = projects.filter(p => p.teamId === team.id || p.teamId === team.name);

                  return (
                    <div
                      key={team.id}
                      onClick={() => openTeamDetail(team)}
                      className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group overflow-hidden"
                    >
                      {/* Card header strip */}
                      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

                      <div className="p-5">
                        {/* Team name + actions */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-semibold text-slate-400">
                                {stats.memberCount} Anggota · {stats.projectCount} Proyek
                              </span>
                            </div>
                          </div>
                          {isCEO && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleOpenEditTeam(team, e)}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-all"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteTeam(team, e)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Member avatars */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {teamMems.slice(0, 5).map(m => (
                            <div
                              key={m.id}
                              className={`w-8 h-8 rounded-full ${getAvatarColor(m.id)} text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm`}
                              title={m.name}
                            >
                              {getInitials(m.name)}
                            </div>
                          ))}
                          {teamMems.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm text-[10px] font-bold text-slate-500 flex items-center justify-center">
                              +{teamMems.length - 5}
                            </div>
                          )}
                          {teamMems.length === 0 && (
                            <span className="text-[10px] text-slate-400 font-medium italic">Belum ada anggota</span>
                          )}
                        </div>

                        {/* Projects */}
                        {teamProjs.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                            {teamProjs.slice(0, 2).map(p => (
                              <span key={p.id} className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full truncate max-w-[130px]">
                                {p.name}
                              </span>
                            ))}
                            {teamProjs.length > 2 && (
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                                +{teamProjs.length - 2} lainnya
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[10px] font-semibold text-blue-500 mt-3 group-hover:text-blue-600 transition-colors">
                          Klik untuk kelola anggota & job →
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════
              TAB: DIREKTORI PERSONEL
          ════════════════════════════════════════════════════════ */}
          {activeTab === 'directory' && (
            <>
              {/* Filters */}
              <div className="glass rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-end gap-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cari Personel</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      id="dir-search"
                      placeholder="Nama atau email..."
                      variant="light"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-1 text-left min-w-[140px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Peran</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="">Semua Peran</option>
                    {Object.values(ROLES).map(r => (
                      <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 text-left min-w-[140px]">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filter Departemen</label>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                  >
                    <option value="">Semua Departemen</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => { setSearch(''); setRoleFilter(''); setDeptFilter(''); }}
                  className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9 mt-4 md:mt-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" /><span>Reset</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase bg-slate-50/50">
                        <th className="py-3.5 px-4">Personel</th>
                        <th className="py-3.5 px-4">Peran</th>
                        <th className="py-3.5 px-4">Departemen</th>
                        <th className="py-3.5 px-4">Tim</th>
                        <th className="py-3.5 px-4">Job di Tim</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                      {members.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                            Tidak ada personel yang cocok dengan filter.
                          </td>
                        </tr>
                      ) : (
                        members.map(member => {
                          const assignedTeam = teams.find(t => t.id === member.team_id);
                          return (
                            <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-9 h-9 rounded-full ${getAvatarColor(member.id)} text-white border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                                    {getInitials(member.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-slate-800 font-bold truncate">{member.name}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold truncate">{member.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(member.role)}`}>
                                  {getRoleIcon(member.role)}
                                  {getRoleLabel(member.role)}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">{member.department || '-'}</td>
                              <td className="py-3.5 px-4">
                                {assignedTeam ? (
                                  <span className="text-xs font-bold text-slate-700">{assignedTeam.name}</span>
                                ) : (
                                  <span className="text-slate-400 font-medium italic text-[10px]">Belum ditugaskan</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 max-w-[200px]">
                                {member.jobDescription ? (
                                  <span className="text-[10px] text-slate-600 leading-relaxed">{member.jobDescription}</span>
                                ) : (
                                  <span className="text-slate-300 font-medium italic text-[10px]">—</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                                  member.isActive
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                }`}>
                                  {member.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════
          TEAM DETAIL MODAL
      ════════════════════════════════════════════════════════════ */}
      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={closeTeamDetail}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Manajemen Tim</p>
                <h2 className="text-lg font-extrabold text-white mt-0.5">{selectedTeam.name}</h2>
                <p className="text-xs text-blue-200 mt-1">
                  {teamMembersOf(selectedTeam.id).length} anggota aktif
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isCEO && teamDetailMode === 'view' && (
                  <button
                    onClick={() => setTeamDetailMode('add_member')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-all border border-white/30"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Tambah Anggota
                  </button>
                )}
                {teamDetailMode !== 'view' && (
                  <button
                    onClick={() => { setTeamDetailMode('view'); setEditingMemberId(null); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-all border border-white/30"
                  >
                    ← Kembali
                  </button>
                )}
                <button
                  onClick={closeTeamDetail}
                  className="p-1.5 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">

              {/* ── VIEW MODE: List current members ── */}
              {teamDetailMode === 'view' && (
                <div className="p-6 space-y-4">
                  {teamMembersOf(selectedTeam.id).length === 0 ? (
                    <div className="py-10 text-center">
                      <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-400 font-semibold">Tim ini belum memiliki anggota.</p>
                      {isCEO && (
                        <button
                          onClick={() => setTeamDetailMode('add_member')}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Tambah Anggota Pertama
                        </button>
                      )}
                    </div>
                  ) : (
                    teamMembersOf(selectedTeam.id).map(member => (
                      <div key={member.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-full ${getAvatarColor(member.id)} text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            {getInitials(member.name)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{member.email}</p>
                              </div>
                              {isCEO && (
                                <button
                                  onClick={() => handleRemoveMemberFromTeam(member)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                                  title="Keluarkan dari tim"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Role badge */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleBadge(member.role)}`}>
                                {getRoleIcon(member.role)}
                                {getRoleLabel(member.role)}
                              </span>
                              {member.department && (
                                <span className="text-[9px] font-semibold text-slate-400">{member.department}</span>
                              )}
                              {member.role === 'INTERN' && member.magang_tier && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full">
                                  Tier {member.magang_tier === 'LEARNING' ? '1' : member.magang_tier === 'APPRENTICE' ? '2' : '3'}
                                </span>
                              )}
                            </div>

                            {/* Job Description */}
                            <div className="mt-2.5">
                              {editingMemberId === member.id ? (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Description di Tim Ini</label>
                                  <textarea
                                    className="w-full bg-white text-slate-800 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 resize-none font-medium leading-relaxed"
                                    rows={3}
                                    placeholder="Contoh: Bertanggung jawab sebagai tech lead frontend, memimpin code review mingguan..."
                                    value={memberJobInput}
                                    onChange={(e) => setMemberJobInput(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveJobDesc(member)}
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all"
                                    >
                                      Simpan
                                    </button>
                                    <button
                                      onClick={() => setEditingMemberId(null)}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-all"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`group/job flex items-start gap-2 ${isCEO ? 'cursor-pointer' : ''}`}
                                  onClick={() => isCEO && handleEditJobDesc(member)}
                                >
                                  <div className="flex-1">
                                    {member.jobDescription ? (
                                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium bg-white border border-slate-100 rounded-lg px-3 py-2">
                                        {member.jobDescription}
                                      </p>
                                    ) : (
                                      <p className="text-[10px] text-slate-300 italic font-medium">
                                        {isCEO ? 'Klik untuk menambah job description...' : 'Belum ada job description.'}
                                      </p>
                                    )}
                                  </div>
                                  {isCEO && (
                                    <Edit className="w-3.5 h-3.5 text-slate-300 group-hover/job:text-blue-500 flex-shrink-0 mt-0.5 transition-colors" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── ADD MEMBER MODE ── */}
              {teamDetailMode === 'add_member' && (
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">Tambah Anggota ke {selectedTeam.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Pilih personel dari daftar yang belum tergabung dalam tim ini.</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama personel..."
                      value={addMemberSearch}
                      onChange={(e) => setAddMemberSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1"
                    />
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {availableToAdd(selectedTeam.id).length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        Semua personel sudah tergabung dalam tim ini atau tidak ada yang tersedia.
                      </div>
                    ) : (
                      availableToAdd(selectedTeam.id).map(member => {
                        const currentTeam = teams.find(t => t.id === member.team_id);
                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full ${getAvatarColor(member.id)} text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0`}>
                                {getInitials(member.name)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{member.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${getRoleBadge(member.role)}`}>
                                    {getRoleIcon(member.role)} {getRoleLabel(member.role)}
                                  </span>
                                  {currentTeam && (
                                    <span className="text-[9px] text-slate-400 font-semibold">dari {currentTeam.name}</span>
                                  )}
                                  {!currentTeam && (
                                    <span className="text-[9px] text-amber-500 font-semibold italic">Belum ditugaskan ke tim</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddMemberToTeam(member)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-all opacity-80 group-hover:opacity-100"
                            >
                              <UserPlus className="w-3 h-3" /> Tambahkan
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          TEAM NAME CREATE/EDIT MODAL
      ════════════════════════════════════════════════════════════ */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingTeam ? 'Ubah Nama Tim' : 'Buat Tim Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {editingTeam ? 'Perbarui nama tim dalam sistem.' : 'Tambahkan struktur tim baru ke dalam sistem.'}
                </p>
              </div>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <Input
                id="teamName"
                label="Nama Tim *"
                placeholder="e.g. Team Delta (IoT Dev)"
                variant="light"
                value={teamFormData.name}
                onChange={(e) => setTeamFormData({ name: e.target.value })}
                required
              />
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
                <Button
                  onClick={() => setIsTeamModalOpen(false)}
                  variant="secondary"
                  className="bg-white hover:bg-slate-50 text-slate-650 border-slate-200 shadow-sm text-xs font-bold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                >
                  {editingTeam ? 'Perbarui Tim' : 'Simpan Tim'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamListPage;

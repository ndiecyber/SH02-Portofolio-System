import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as testimonialApi from '../../services/testimonialApi';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Search, RefreshCw, Edit, Trash2, X, Star, CheckCircle, EyeOff, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const TestimonialListPage = () => {
  const navigate = useNavigate();
  const { isCEO, isPM, isClient, isJuniorIntern, user } = useRole();

  const hasAccess = isCEO || isPM || isClient || isJuniorIntern;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    rating: 4.8,
    reviewsCount: 15,
    breakdown: { 5: 12, 4: 2, 3: 1, 2: 0, 1: 0 }
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    projectId: '',
    quote: '',
    rating: 5,
    status: 'Draft'
  });

  useEffect(() => {
    if (!hasAccess && !loading) {
      navigate('/unauthorized');
    }
  }, [hasAccess, navigate, loading]);

  const loadData = useCallback(async () => {
    if (!hasAccess) return;
    setLoading(true);
    setError(null);
    try {
      const [testRes, projRes] = await Promise.all([
        testimonialApi.getTestimonials({ search, status: statusFilter }),
        projectApi.getProjects()
      ]);
      setTestimonials(testRes.testimonials);

      // Filter projects based on role for dropdown
      let availableProjects = projRes.projects;
      if (isClient && user) {
        // Client can only submit testimonials for their own completed projects
        availableProjects = availableProjects.filter(
          (p) => p.client === user.clientName && p.status === 'Completed'
        );
      }
      setProjects(availableProjects);

      // Calculate rating stats dynamically
      const published = testRes.testimonials.filter(t => t.status === 'Published');
      if (published.length > 0) {
        const totalRating = published.reduce((acc, curr) => acc + curr.rating, 0);
        const avg = parseFloat((totalRating / published.length).toFixed(1));
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        published.forEach(t => {
          if (breakdown[t.rating] !== undefined) {
            breakdown[t.rating]++;
          }
        });
        setStats({
          rating: avg,
          reviewsCount: published.length,
          breakdown
        });
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data testimoni.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, hasAccess, isClient, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: isClient && user ? user.clientName : '',
      projectId: projects[0]?.id || '',
      quote: '',
      rating: 5,
      status: isClient ? 'Draft' : 'Published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName || '',
      projectId: testimonial.projectId || '',
      quote: testimonial.quote || '',
      rating: testimonial.rating || 5,
      status: testimonial.status || 'Draft'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.quote || !formData.projectId) {
      Swal.fire('Error', 'Semua bidang form wajib diisi.', 'error');
      return;
    }

    try {
      if (editingTestimonial) {
        await testimonialApi.updateTestimonial(editingTestimonial.id, formData);
        Swal.fire('Berhasil!', 'Testimoni berhasil diperbarui.', 'success');
      } else {
        await testimonialApi.createTestimonial(formData);
        Swal.fire('Berhasil!', 'Testimoni berhasil dikirim.', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal menyimpan testimoni.', 'error');
    }
  };

  const handleDelete = (id, client) => {
    Swal.fire({
      title: 'Hapus Testimoni',
      html: `Apakah Anda yakin ingin menghapus testimoni dari <b class="text-red-400">${client}</b>?`,
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
          await testimonialApi.deleteTestimonial(id);
          Swal.fire('Berhasil!', 'Testimoni berhasil dihapus.', 'success');
          loadData();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus testimoni.', 'error');
        }
      }
    });
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      if (currentStatus === 'Published') {
        await testimonialApi.unpublishTestimonial(id);
        Swal.fire('Sukses', 'Testimoni diarsipkan menjadi Draft.', 'success');
      } else {
        await testimonialApi.publishTestimonial(id);
        Swal.fire('Sukses', 'Testimoni berhasil dipublikasikan.', 'success');
      }
      loadData();
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal memperbarui status publikasi.', 'error');
    }
  };

  const renderStars = (rating, onClick = null, size = "w-4 h-4") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size} ${
            i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
          } ${onClick ? 'cursor-pointer hover:scale-115 transition-transform' : ''}`}
          onClick={() => onClick && onClick(i)}
        />
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  if (!hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader size="md" />
        <p className="text-xs text-slate-400 font-semibold">Memeriksa hak akses...</p>
      </div>
    );
  }

  // Can manage testimonials: CEO and PM
  const canWrite = isCEO || isPM;
  // Can add testimonial: CEO, PM, and Client (if they have completed projects)
  const canAdd = isCEO || isPM || (isClient && projects.length > 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Testimoni Klien</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Pantau ulasan kepuasan, rating bintang, dan feedback resmi hasil kerja sama proyek.
          </p>
        </div>

        {canAdd && (
          <Button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tulis Testimoni Baru</span>
          </Button>
        )}
      </div>

      {/* Testimonials Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rating Score Card */}
        <div className="glass rounded-2xl p-5 border border-slate-200 bg-white flex flex-col items-center justify-center text-center shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rata-Rata Kepuasan</p>
          <p className="text-5xl font-extrabold text-slate-800 tracking-tighter">{stats.rating}</p>
          <div className="mt-2.5">{renderStars(Math.round(stats.rating), null, "w-5 h-5")}</div>
          <p className="text-[10px] text-slate-400 font-bold mt-2">Berdasarkan {stats.reviewsCount} Testimoni Aktif</p>
        </div>

        {/* Breakdown bar charts */}
        <div className="glass rounded-2xl p-5 border border-slate-200 bg-white lg:col-span-2 shadow-sm space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.breakdown[stars] || 0;
            const percentage = stats.reviewsCount > 0 ? (count / stats.reviewsCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center text-xs text-slate-500 font-bold space-x-3">
                <span className="w-3 text-right">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-150">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400 font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters (only for CEO/PM/Client) */}
      {!isJuniorIntern && (
        <div className="glass rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-end md:items-center gap-4 justify-between shadow-sm">
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari nama klien atau ulasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {canWrite && (
              <div className="flex flex-col space-y-1 w-40 text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold w-full"
                >
                  <option value="">Semua Status</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            )}

            <button
              onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="flex items-center space-x-1 py-2 px-3.5 bg-white hover:bg-slate-50 text-slate-650 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Testimonials List Grid */}
      <div className="glass rounded-xl border border-slate-200 shadow-sm p-2 overflow-hidden bg-white">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil ulasan...</p>
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
                  <th className="py-3.5 px-4">Nama Klien</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Ulasan (Quote)</th>
                  <th className="py-3.5 px-4">Status</th>
                  {(canWrite || isClient) && <th className="py-3.5 px-4 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                      Belum ada ulasan yang sesuai.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((test) => {
                    const isAuthor = isClient && test.clientName === user?.clientName;
                    const canEditThis = canWrite || isAuthor;
                    const relatedProject = projects.find(p => p.id === test.projectId);

                    return (
                      <tr key={test.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4 pr-2">
                          <div>
                            <p className="text-slate-800 font-bold">{test.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Proyek: {relatedProject ? relatedProject.name : 'Proyek LEXA'}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-4">{renderStars(test.rating)}</td>

                        <td className="py-4 px-4 text-slate-550 max-w-[320px] leading-relaxed font-semibold">
                          "{test.quote}"
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                            test.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                            {test.status}
                          </span>
                        </td>

                        {(canWrite || isClient) && (
                          <td className="py-4 px-4 text-right">
                            <div className="inline-flex space-x-1.5">
                              {/* Publish toggle (only Admin/PM) */}
                              {canWrite && (
                                <button
                                  onClick={() => handleTogglePublish(test.id, test.status)}
                                  title={test.status === 'Published' ? 'Arsipkan Testimoni' : 'Publikasikan Testimoni'}
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    test.status === 'Published'
                                      ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                                      : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                  }`}
                                >
                                  {test.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </button>
                              )}

                              {canEditThis && (
                                <>
                                  <button
                                    onClick={() => handleOpenEdit(test)}
                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-all"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(test.id, test.clientName)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
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
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingTestimonial ? 'Ubah Testimoni Klien' : 'Tulis Testimoni Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Berikan feedback ulasan tentang kualitas hasil pengerjaan proyek.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-6 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-650">
                  Tidak ada proyek selesai (Completed) yang memenuhi syarat untuk Anda komentari saat ini.
                </p>
                <Button onClick={() => setIsModalOpen(false)} variant="secondary" className="text-xs font-bold bg-white text-slate-650 border border-slate-205 shadow-sm">
                  Tutup
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="clientName"
                  label="Nama Perusahaan/Klien *"
                  placeholder="e.g. Bank Mandiri"
                  variant="light"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                  disabled={isClient}
                />

                {/* Related Project Selection */}
                <div className="space-y-1 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terkait Proyek *</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    required
                  >
                    <option value="">Pilih Proyek...</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.client})</option>
                    ))}
                  </select>
                </div>

                {/* Rating selection (Interactive stars) */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rating Kepuasan *</label>
                  <div className="py-1">
                    {renderStars(formData.rating, (newRating) => setFormData({ ...formData, rating: newRating }), "w-7 h-7")}
                  </div>
                </div>

                {/* Quote Textarea */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ulasan / Testimoni *</label>
                  <textarea
                    rows={4}
                    placeholder="Tulis ulasan Anda mengenai pengerjaan, komunikasi tim, kualitas kode, atau hasil delivery..."
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    required
                  />
                </div>

                {/* Status Selection (only for CEO/PM) */}
                {canWrite && (
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Publikasi</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                    >
                      <option value="Published">Published (Tampil di Website)</option>
                      <option value="Draft">Draft (Arsip)</option>
                    </select>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
                    className="bg-white hover:bg-slate-50 text-slate-650 border-slate-205 shadow-sm text-xs font-bold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                  >
                    {editingTestimonial ? 'Perbarui Testimoni' : 'Kirim Testimoni'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialListPage;

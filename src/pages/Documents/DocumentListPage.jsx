import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as documentApi from '../../services/documentApi';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { Search, RefreshCw, Trash2, Download, Upload, X, FileText, Image, FileCode, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';

const DocumentListPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isCEO, isPM, isDeveloper, isUIUX, isQA, isIntern, isLearningIntern, user } = useRole();

  // Access checks
  const hasAccess = isCEO || isPM || isDeveloper || isUIUX || isQA || isIntern;
  const canUpload = isCEO || isPM || isDeveloper || isUIUX || isQA || (isIntern && !isLearningIntern);
  const canDelete = isCEO || isPM;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [projects, setProjects] = useState([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  // Upload Modal / Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    category: 'API Spec',
    projectId: ''
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
      const [docRes, projRes] = await Promise.all([
        documentApi.getDocuments({
          search,
          category: categoryFilter,
          projectId: projectFilter
        }),
        projectApi.getProjects()
      ]);
      setDocuments(docRes.documents);

      // Filter projects based on role for upload selection
      let availableProjects = projRes.projects;
      if (isIntern && user) {
        availableProjects = availableProjects.filter(p => p.teamId === user.team_id);
      } else if (!isCEO) {
        const assignedIds = user?.assignedProjects || [];
        availableProjects = availableProjects.filter(
          p => assignedIds.includes(p.id) || p.teamMembers?.includes(user?.id)
        );
      }
      setProjects(availableProjects);
      
      // Auto-set first project in upload form
      if (availableProjects.length > 0) {
        setFormData(prev => ({ ...prev, projectId: availableProjects[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data dokumen.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, projectFilter, hasAccess, isIntern, isCEO, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Ukuran file maksimal 2 MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadProgress(null);
    setIsModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Harap pilih file terlebih dahulu.');
      return;
    }
    if (!formData.projectId) {
      setUploadError('Tentukan proyek terkait berkas.');
      return;
    }

    setUploadProgress('Membaca file...');
    setUploadError(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          
          // Get the selected project to populate teamId
          const project = projects.find(p => p.id === formData.projectId);
          const teamId = project ? project.teamId : 'team-a';
          
          const payload = {
            fileName: selectedFile.name,
            category: formData.category,
            size: (selectedFile.size / 1024 > 1000) 
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
              : `${Math.round(selectedFile.size / 1024)} KB`,
            url: base64Data,
            projectId: formData.projectId,
            teamId
          };

          setUploadProgress('Mengunggah...');
          await documentApi.createDocument(payload);
          
          setUploadProgress(null);
          setIsModalOpen(false);
          Swal.fire('Berhasil!', 'Dokumen berhasil diunggah.', 'success');
          loadData();
        } catch (err) {
          setUploadError(err.message || 'Gagal menyimpan dokumen.');
          setUploadProgress(null);
        }
      };

      reader.onerror = () => {
        setUploadError('Gagal membaca file lokal.');
        setUploadProgress(null);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setUploadError(err.message || 'Gagal memproses file.');
      setUploadProgress(null);
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await documentApi.downloadDocument(docId);
      
      // Simulate click download
      const link = window.document.createElement('a');
      link.href = res.url;
      link.download = res.fileName || fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      Swal.fire({
        title: 'Downloaded!',
        text: `Berkas ${fileName} berhasil diunduh.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#f8fafc',
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'Gagal mengunduh berkas.', 'error');
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Hapus Dokumen',
      html: `Apakah Anda yakin ingin menghapus berkas <b class="text-red-400">${name}</b>?`,
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
          await documentApi.deleteDocument(id);
          Swal.fire('Berhasil!', 'Berkas berhasil dihapus.', 'success');
          loadData();
        } catch (err) {
          Swal.fire('Error', err.message || 'Gagal menghapus berkas.', 'error');
        }
      }
    });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText className="w-5 h-5 text-blue-500" />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (['fig', 'sketch', 'xd', 'png', 'jpg', 'jpeg', 'svg'].includes(ext)) {
      return <Image className="w-5 h-5 text-indigo-500" />;
    } else if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-emerald-500" />;
    } else {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader size="md" />
        <p className="text-xs text-slate-400 font-semibold">Memeriksa hak akses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dokumen & File Proyek</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isIntern 
              ? 'Kelola spesifikasi, modul, dan berkas tugas pengembangan khusus tim Anda.'
              : 'Pusat repositori file, spesifikasi API, wireframes, dan aset implementasi proyek.'}
          </p>
        </div>

        {canUpload && (
          <Button
            onClick={handleOpenUpload}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            <Upload className="w-4.5 h-4.5" />
            <span>Unggah Dokumen</span>
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
            placeholder="Cari nama berkas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
          />
        </div>

        {/* Multi-Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold"
            >
              <option value="">Semua Kategori</option>
              <option value="API Spec">API Spec</option>
              <option value="Design">Design</option>
              <option value="Architecture">Architecture</option>
              <option value="Report">Report</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="flex flex-col space-y-1 w-full sm:w-40 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Terkait Proyek</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-850 focus:outline-none focus:border-blue-500 focus:ring-1 font-semibold w-full"
            >
              <option value="">Semua Proyek</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setSearch(''); setCategoryFilter(''); setProjectFilter(''); }}
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
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader size="lg" />
            <p className="text-xs text-slate-400 font-semibold">Mengambil daftar berkas...</p>
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
                  <th className="py-3.5 px-4">Nama File</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Terkait Proyek</th>
                  <th className="py-3.5 px-4">Ukuran</th>
                  <th className="py-3.5 px-4">Tanggal Unggah</th>
                  <th className="py-3.5 px-4">Pengunggah</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada dokumen yang diunggah.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const relatedProject = projects.find(p => p.id === doc.projectId);
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Name with icon */}
                        <td className="py-4 px-4 font-bold text-slate-800 flex items-center space-x-2.5 max-w-[240px]">
                          {getFileIcon(doc.fileName)}
                          <span className="truncate" title={doc.fileName}>{doc.fileName}</span>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 text-slate-500 font-bold">{doc.category}</td>

                        {/* Project */}
                        <td className="py-4 px-4 text-slate-500 font-bold max-w-[160px] truncate">
                          {relatedProject ? relatedProject.name : 'General Assets'}
                        </td>

                        {/* Size */}
                        <td className="py-4 px-4 text-slate-400 font-mono font-bold">{doc.size}</td>

                        {/* Date */}
                        <td className="py-4 px-4 text-slate-500">{doc.uploadDate}</td>

                        {/* Uploader */}
                        <td className="py-4 px-4 text-slate-600 font-bold">{doc.uploadedBy}</td>

                        {/* Action buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex space-x-1.5">
                            <button
                              onClick={() => handleDownload(doc.id, doc.fileName)}
                              title="Download File"
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-550 rounded-lg border border-slate-205 transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(doc.id, doc.fileName)}
                                title="Hapus Dokumen"
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-150 shadow-2xl max-w-md w-full p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Unggah Dokumen Baru</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Unggah file spesifikasi, wireframe, atau laporan proyek.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {uploadError && <Alert type="error" message={uploadError} />}

              {/* Drag-and-drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors p-6 cursor-pointer flex flex-col items-center justify-center text-center group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.fig,.doc,.docx,.xls,.xlsx,.zip"
                />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-800 max-w-[240px] truncate mx-auto">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors mx-auto" />
                    <p className="text-xs font-bold text-slate-650">
                      Klik untuk mencari file atau seret file ke sini
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold">
                      Format PDF, PNG, JPG, FIG, ZIP s/d 2 MB
                    </p>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1 text-left">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori Berkas</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 font-semibold"
                >
                  <option value="API Spec">API Spec</option>
                  <option value="Design">Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Report">Report</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Related Project */}
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
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons / Loader */}
              {uploadProgress ? (
                <div className="py-2.5 flex items-center justify-center space-x-2.5 text-xs text-blue-600 font-bold">
                  <Loader size="sm" />
                  <span>{uploadProgress}</span>
                </div>
              ) : (
                <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-6">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
                    className="bg-white hover:bg-slate-50 text-slate-655 border-slate-205 shadow-sm text-xs font-bold"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
                    disabled={!selectedFile}
                  >
                    Unggah File
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;

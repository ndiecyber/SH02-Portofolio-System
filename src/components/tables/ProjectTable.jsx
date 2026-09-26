import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useRole } from '../../hooks/useRole';
import clsx from 'clsx';

const getInitials = (name) => {
  if (!name) return 'PR';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getAvatarBg = (name) => {
  const colors = [
    'from-blue-600 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-indigo-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ProjectTable = ({ projects = [], onDeleteClick }) => {
  const { canEditProject, canDeleteProject } = useRole();

  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
      case 'in progress':
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
      case 'on hold':
      case 'on_hold':
        return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
      case 'planning':
        return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-650 border border-slate-500/20';
    }
  };

  const formatStatus = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed') return 'Completed';
    if (s === 'in progress' || s === 'in_progress') return 'In Progress';
    if (s === 'on hold' || s === 'on_hold') return 'On Hold';
    if (s === 'planning') return 'Planning';
    return status || 'Planning';
  };

  const formatCurrency = (val) => {
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(Number(val));
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            <th className="py-3.5 px-4">Project Details</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Budget</th>
            <th className="py-3.5 px-4">Progress</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
          {projects.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                Tidak ada data proyek yang cocok dengan filter Anda.
              </td>
            </tr>
          ) : (
            projects.map((project) => {
              const progress = Number(project.progressPercentage ?? project.progress ?? 0);
              const category = project.category || project.serviceName || project.service?.name || 'Development';
              const statusDisplay = formatStatus(project.status);

              return (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Project Details (Thumbnail + Name + Client) */}
                  <td className="py-4 px-4 pr-2 max-w-[240px]">
                    <div className="flex items-center space-x-3">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-150 flex-shrink-0"
                        />
                      ) : null}
                      <div
                        style={{ display: project.thumbnail ? 'none' : 'flex' }}
                        className={clsx(
                          "w-11 h-11 rounded-xl bg-gradient-to-br text-white font-extrabold text-xs items-center justify-center flex-shrink-0 shadow-sm",
                          getAvatarBg(project.name)
                        )}
                      >
                        {getInitials(project.name)}
                      </div>
                      <div className="min-w-0 space-y-0.5 text-left">
                        <p className="text-slate-800 group-hover:text-blue-600 transition-colors truncate font-bold">
                          {project.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate">
                          Client: {project.clientName || project.client?.name || 'Client'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 text-slate-500 font-bold text-left">{category}</td>

                  {/* Status */}
                  <td className="py-4 px-4 text-left">
                    <span className={clsx("px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider", getStatusStyle(project.status))}>
                      {statusDisplay}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="py-4 px-4 text-slate-700 font-mono font-bold text-left">
                    {formatCurrency(project.budget)}
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 px-4 w-40 text-left">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-150">
                        <div
                          className={clsx(
                            "rounded-full h-full transition-all duration-500",
                            statusDisplay === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold w-7 text-right">
                        {progress}%
                      </span>
                    </div>
                  </td>

                {/* Actions */}
                <td className="py-4 px-4 text-right">
                  <div className="inline-flex space-x-1.5">
                    <Link
                      to={`/projects/${project.id}`}
                      title="View Details"
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg border border-slate-205 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {canEditProject(project) && (
                      <Link
                        to={`/projects/${project.id}/edit`}
                        title="Edit Project"
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    )}

                    {canDeleteProject && (
                      <button
                        onClick={() => onDeleteClick(project.id, project.name)}
                        title="Delete Project"
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
  );
};

export default ProjectTable;

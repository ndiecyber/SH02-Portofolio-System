import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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

const RecentProjectsList = ({ projects = [] }) => {
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

  return (
    <div className="glass rounded-xl p-2.5 border border-slate-200 dark:border-[#30363d] shadow-sm flex flex-col h-56 lg:h-full">
      <div className="flex items-center justify-between mb-1.5 border-b border-slate-100 dark:border-[#30363d] pb-1.5">
        <div className="text-left">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Recent Projects</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Last updated portfolio assets</p>
        </div>
        <Link
          to="/projects"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[140px] pr-1">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#30363d] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              <th className="py-1.5 pl-1">Project Name</th>
              <th className="py-1.5 px-2">Client</th>
              <th className="py-1.5 px-2">Status</th>
              <th className="py-1.5 px-2">Progress</th>
              <th className="py-1.5 pr-1 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#30363d] text-[11px] font-semibold text-slate-650 dark:text-slate-300">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-3 text-center text-slate-500 dark:text-slate-400 font-medium">
                  Tidak ada proyek baru.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="py-1.5 pl-1 pr-2 flex items-center space-x-2">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        className="w-6 h-6 rounded object-cover border border-slate-150 dark:border-slate-700 flex-shrink-0"
                      />
                    ) : null}
                    <div
                      style={{ display: project.thumbnail ? 'none' : 'flex' }}
                      className={clsx(
                        "w-6 h-6 rounded bg-gradient-to-br text-white font-extrabold text-[9px] items-center justify-center flex-shrink-0 shadow-xs",
                        getAvatarBg(project.name)
                      )}
                    >
                      {getInitials(project.name)}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-bold max-w-[150px]">
                      {project.name}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400 truncate max-w-[110px]">
                    {project.client || project.clientName || 'Client'}
                  </td>
                  <td className="py-1.5 px-2">
                    <span className={clsx("px-1.5 py-0.5 rounded text-[8px] font-extrabold whitespace-nowrap", getStatusStyle(project.status))}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-1.5 px-2 w-24">
                    <div className="flex items-center space-x-1.5">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div
                          className={clsx(
                            "rounded-full h-full",
                            project.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold w-5 text-right flex-shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-1.5 pr-1 text-right">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center justify-center p-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded border border-slate-200 dark:border-slate-700 transition-all"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjectsList;

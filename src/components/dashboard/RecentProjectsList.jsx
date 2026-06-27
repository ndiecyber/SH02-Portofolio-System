import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

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
    <div className="glass rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Projects</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Last updated portfolio assets</p>
        </div>
        <Link
          to="/projects"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              <th className="py-2.5">Project Name</th>
              <th className="py-2.5">Client</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5">Progress</th>
              <th className="py-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-slate-500 font-medium">
                  Tidak ada proyek baru.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 flex items-center space-x-3 pr-2">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-150 flex-shrink-0"
                    />
                    <span className="text-slate-800 group-hover:text-blue-600 transition-colors truncate font-bold max-w-[180px]">
                      {project.name}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 truncate max-w-[120px]">{project.client}</td>
                  <td className="py-3">
                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-bold", getStatusStyle(project.status))}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 w-32 pr-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={clsx(
                            "rounded-full h-full",
                            project.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-extrabold w-6 text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center justify-center p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-lg border border-slate-200 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
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

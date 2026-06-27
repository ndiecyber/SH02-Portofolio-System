import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Globe, EyeOff } from 'lucide-react';
import { useRole } from '../../hooks/useRole';
import clsx from 'clsx';

const CaseStudyTable = ({ caseStudies = [], onPublishToggle, onDeleteClick }) => {
  const { isCEO, isPM } = useRole();

  // Find project name by project ID
  const getProjectName = (projId) => {
    try {
      const projects = JSON.parse(localStorage.getItem('sh02_db_projects') || '[]');
      const match = projects.find(p => p.id === projId);
      return match ? match.name : 'Unknown Project';
    } catch {
      return 'Unknown Project';
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            <th className="py-3.5 px-4">Case Study Title</th>
            <th className="py-3.5 px-4">Project Scope</th>
            <th className="py-3.5 px-4">Client</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Published Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
          {caseStudies.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">
                Tidak ada data case study.
              </td>
            </tr>
          ) : (
            caseStudies.map((cs) => {
              const isPublished = cs.status === 'Published';
              return (
                <tr key={cs.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Title & Preview tag */}
                  <td className="py-4 px-4 pr-2 max-w-[280px]">
                    <div className="flex items-center space-x-2 text-left">
                      <span className="text-slate-800 group-hover:text-blue-600 transition-colors truncate font-bold block">
                        {cs.title}
                      </span>
                    </div>
                  </td>

                  {/* Project Name */}
                  <td className="py-4 px-4 text-slate-500 truncate max-w-[180px] text-left">{getProjectName(cs.projectId)}</td>

                  {/* Client */}
                  <td className="py-4 px-4 text-slate-500 font-bold text-left">{cs.client}</td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-left">
                    <span className={clsx(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border",
                      isPublished
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    )}>
                      {cs.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-slate-500 font-mono text-left">
                    {cs.publishedDate || '-'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex space-x-1.5">
                      {/* Publish / Unpublish Toggle button (CEO and PM only) */}
                      {(isCEO || isPM) && (
                        <button
                          onClick={() => onPublishToggle(cs.id, isPublished)}
                          title={isPublished ? 'Unpublish / Draft' : 'Publish to Public'}
                          className={clsx(
                            "p-1.5 rounded-lg border transition-all",
                            isPublished
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                          )}
                        >
                          {isPublished ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </button>
                      )}

                      <Link
                        to={`/case-studies/${cs.id}/edit`}
                        title="Edit Case Study"
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => onDeleteClick(cs.id, cs.title)}
                        title="Delete Case Study"
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
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
  );
};

export default CaseStudyTable;

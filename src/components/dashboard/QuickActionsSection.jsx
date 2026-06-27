import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, BookOpen, MessageSquare, FileText, BarChart3 } from 'lucide-react';
import { useRole } from '../../hooks/useRole';

const QuickActionsSection = () => {
  const navigate = useNavigate();
  const { canCreateProject, canManageCaseStudies, canViewReports } = useRole();

  const actions = [
    {
      name: 'Add Project',
      icon: Briefcase,
      color: 'bg-blue-50/60 hover:bg-blue-100/80 text-blue-600 border-blue-200',
      show: canCreateProject,
      onClick: () => navigate('/projects/new')
    },
    {
      name: 'Add Case Study',
      icon: BookOpen,
      color: 'bg-purple-50/60 hover:bg-purple-100/80 text-purple-600 border-purple-200',
      show: canManageCaseStudies(),
      onClick: () => navigate('/case-studies/new')
    },
    {
      name: 'Add Testimonial',
      icon: MessageSquare,
      color: 'bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-600 border-emerald-200',
      show: true,
      onClick: () => alert('Testimonials module is scheduled for Week 3.')
    },
    {
      name: 'Upload Document',
      icon: FileText,
      color: 'bg-amber-50/60 hover:bg-amber-100/80 text-amber-600 border-amber-200',
      show: true,
      onClick: () => alert('Documents module is scheduled for Week 4.')
    },
    {
      name: 'View Reports',
      icon: BarChart3,
      color: 'bg-sky-50/60 hover:bg-sky-100/80 text-sky-650 border-sky-200',
      show: canViewReports(),
      onClick: () => alert('Reports & Analytics module is scheduled for Week 4.')
    }
  ].filter(action => action.show);

  if (actions.length === 0) return null;

  return (
    <div className="glass rounded-xl p-5 border border-slate-200 shadow-sm text-left">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.name}
              onClick={act.onClick}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 active:scale-95 space-y-2 text-center ${act.color}`}
            >
              <Icon className="w-5.5 h-5.5" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{act.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsSection;

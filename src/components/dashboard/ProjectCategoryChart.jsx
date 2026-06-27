import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const ProjectCategoryChart = ({ data = [] }) => {
  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="glass rounded-xl p-5 border border-slate-200 h-96 flex flex-col justify-between shadow-sm relative">
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Projects by Category</h3>
        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Distribution across services</p>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-slate-400 text-xs font-semibold">Tidak ada data proyek.</p>
        ) : (
          <>
            {/* Centered Total Projects Count */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-2xl font-extrabold text-slate-800">{total}</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontWeight: '600',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {data.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>{entry.name}</span>
              <span className="text-slate-800">({entry.value})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectCategoryChart;

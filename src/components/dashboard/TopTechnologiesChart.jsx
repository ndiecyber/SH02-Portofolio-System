import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const TopTechnologiesChart = ({ data = [] }) => {
  const COLORS = ['#2563eb', '#8b5cf6', '#a78bfa', '#c084fc', '#e879f9'];

  return (
    <div className="glass rounded-xl p-2.5 border border-slate-200 h-48 lg:h-full flex flex-col shadow-sm">
      <div className="text-left">
        <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Top Technologies</h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Percentage of usage across active projects</p>
      </div>

      <div className="flex-1 w-full text-xs font-semibold mt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-400 text-xs font-semibold">Tidak ada data teknologi.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 2, right: 15, left: -20, bottom: 2 }}
            >
              <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} unit="%" hide />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#475569"
                tickLine={false}
                axisLine={false}
                width={80}
                className="text-[10px] font-bold"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Usage']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={12}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopTechnologiesChart;

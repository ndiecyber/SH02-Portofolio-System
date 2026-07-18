import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ProjectOverviewChart = ({ data = [] }) => {
  return (
    <div className="glass rounded-xl p-2.5 border border-slate-200 h-52 lg:h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-left">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Project Overview</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Timeline trends for the past 6 months</p>
        </div>
      </div>

      <div className="flex-1 w-full text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              className="text-[10px]"
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              className="text-[10px]"
            />
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
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', color: '#64748b' }}
            />
            <Line
              type="monotone"
              dataKey="Total Projects"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="In Progress"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProjectOverviewChart;

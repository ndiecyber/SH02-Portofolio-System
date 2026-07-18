import React from 'react';
import clsx from 'clsx';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, trendType = 'up', trendData = [10, 12, 15, 13, 18, 20] }) => {
  const colorMap = {
    blue: {
      card: 'bg-white border-slate-200 text-slate-800',
      iconContainer: 'bg-blue-500/10 border-blue-500/10 text-blue-600',
      lineStroke: '#2563eb',
      glow: 'group-hover:from-blue-500/10'
    },
    green: {
      card: 'bg-white border-slate-200 text-slate-800',
      iconContainer: 'bg-emerald-500/10 border-emerald-500/10 text-emerald-600',
      lineStroke: '#10b981',
      glow: 'group-hover:from-emerald-500/10'
    },
    orange: {
      card: 'bg-white border-slate-200 text-slate-800',
      iconContainer: 'bg-amber-500/10 border-amber-500/10 text-amber-600',
      lineStroke: '#f59e0b',
      glow: 'group-hover:from-amber-500/10'
    },
    purple: {
      card: 'bg-white border-slate-200 text-slate-800',
      iconContainer: 'bg-violet-500/10 border-violet-500/10 text-violet-600',
      lineStroke: '#8b5cf6',
      glow: 'group-hover:from-violet-500/10'
    },
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  // Format trendData array of numbers into recharts object array
  const formattedChartData = trendData.map((val, idx) => ({ id: idx, value: val }));

  return (
    <div className={clsx(
      "rounded-xl p-3 border flex items-center justify-between hover:border-slate-350 dark:hover:border-slate-600 transition-all duration-300 shadow-sm relative overflow-hidden group",
      "bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-slate-100"
    )}>
      {/* Background glow animation */}
      <div className={clsx(
        "absolute -inset-y-12 -inset-x-12 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl rounded-full",
        currentTheme.glow
      )} />

      <div className="space-y-0.5 relative z-10 flex-1 min-w-0 text-left">
        <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase block">{title}</span>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
        </div>
        {trend && (
          <span className={clsx(
            "text-[9px] font-bold px-1 py-0.5 rounded-full inline-block",
            trendType === 'up' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
          )}>
            {trend}
          </span>
        )}
      </div>

      {/* Sparkline Miniature Trend Line Chart */}
      <div className="w-16 h-8 mx-1.5 flex-shrink-0 relative z-10 hidden sm:block">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedChartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentTheme.lineStroke}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Icon block */}
      <div className={clsx("p-2 rounded-lg border relative z-10 flex-shrink-0", currentTheme.iconContainer)}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
};

export default StatCard;

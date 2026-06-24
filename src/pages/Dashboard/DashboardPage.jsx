import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-dark-muted mt-1">
          Welcome back, {user?.name || 'Lexa Admin'}! Here is your administration control center.
        </p>
      </div>
      <div className="glass rounded-xl p-8 border border-dark-border text-center max-w-2xl mx-auto my-12">
        <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Dashboard Visualizations & Stats</h2>
        <p className="text-sm text-dark-muted leading-relaxed">
          The interactive widgets, Project Overview line charts, category breakdowns, and client reviews metrics will be established during the next stage of Week 1 (Days 4-7).
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;

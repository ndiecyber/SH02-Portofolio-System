import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as dashboardApi from '../../services/dashboardApi';
import StatCard from '../../components/dashboard/StatCard';
import ProjectOverviewChart from '../../components/dashboard/ProjectOverviewChart';
import ProjectCategoryChart from '../../components/dashboard/ProjectCategoryChart';
import TopTechnologiesChart from '../../components/dashboard/TopTechnologiesChart';
import ClientSatisfactionCard from '../../components/dashboard/ClientSatisfactionCard';
import RecentProjectsList from '../../components/dashboard/RecentProjectsList';
import QuickActionsSection from '../../components/dashboard/QuickActionsSection';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { Briefcase, CheckCircle2, RefreshCw, Users } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [overviewData, setOverviewData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [techData, setTechData] = useState([]);
  const [satisfactionData, setSatisfactionData] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Run parallel calls
      const [sum, over, cat, tech, sat, rec] = await Promise.all([
        dashboardApi.getDashboardSummary(),
        dashboardApi.getProjectsOverview(),
        dashboardApi.getProjectsByCategory(),
        dashboardApi.getTopTechnologies(),
        dashboardApi.getClientSatisfaction(),
        dashboardApi.getRecentProjects(),
      ]);

      setSummary(sum);
      setOverviewData(over);
      setCategoryData(cat);
      setTechData(tech);
      setSatisfactionData(sat);
      setRecentProjects(rec);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError(err.message || 'Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader size="lg" />
        <p className="text-sm font-semibold text-slate-400">Memuat analisis statistik & visualisasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert type="error" message={error} />
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Master Dashboard</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Selamat datang kembali, <span className="text-blue-600 font-bold">{user?.name}</span>. Berikut ringkasan proyek LEXA Software House.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="self-start flex items-center space-x-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold border border-slate-200 shadow-sm transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Quick Actions Shortcuts for Admins/PM */}
      <QuickActionsSection />

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={summary?.totalProjects || 0}
          icon={Briefcase}
          color="blue"
          trend="+12% dari bulan lalu"
          trendType="up"
          trendData={[10, 14, 17, 21, 25, summary?.totalProjects || 28]}
        />
        <StatCard
          title="Completed Projects"
          value={summary?.completedProjects || 0}
          icon={CheckCircle2}
          color="green"
          trend="+17% dari bulan lalu"
          trendType="up"
          trendData={[5, 8, 10, 11, 13, summary?.completedProjects || 15]}
        />
        <StatCard
          title="In Progress"
          value={summary?.inProgressProjects || 0}
          icon={RefreshCw}
          color="orange"
          trend="+8% dari bulan lalu"
          trendType="up"
          trendData={[2, 5, 8, 6, 9, summary?.inProgressProjects || 8]}
        />
        <StatCard
          title="Total Clients"
          value={summary?.totalClients || 0}
          icon={Users}
          color="purple"
          trend="+5% dari bulan lalu"
          trendType="up"
          trendData={[12, 14, 15, 18, 20, summary?.totalClients || 21]}
        />
      </div>

      {/* Grid of Main Charts (Row 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectOverviewChart data={overviewData} />
        </div>
        <div>
          <ProjectCategoryChart data={categoryData} />
        </div>
      </div>

      {/* Grid of Secondary Widgets (Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <TopTechnologiesChart data={techData} />
        </div>
        <div>
          <ClientSatisfactionCard data={satisfactionData} />
        </div>
        <div className="lg:col-span-1">
          <RecentProjectsList projects={recentProjects} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

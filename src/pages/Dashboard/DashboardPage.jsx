import React, { useState, useEffect } from 'react';
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
      <div className="h-full flex flex-col items-center justify-center space-y-3">
        <Loader size="lg" />
        <p className="text-xs font-semibold text-slate-400">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <button
          onClick={fetchData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  const totalProj = summary?.totalProjects || 0;
  const completedProj = summary?.completedProjects || 0;
  const inProgressProj = summary?.inProgressProjects || 0;
  const totalClients = summary?.totalClients || 0;

  const completedPct = totalProj > 0 ? Math.round((completedProj / totalProj) * 100) : 0;
  const inProgressPct = totalProj > 0 ? Math.round((inProgressProj / totalProj) * 100) : 0;

  const totalTrendData = overviewData.length > 0 ? overviewData.map((d) => d['Total Projects']) : [1, 2, 3, 4, 5, totalProj];
  const completedTrendData = overviewData.length > 0 ? overviewData.map((d) => d['Completed']) : [0, 0, 1, 1, 1, completedProj];
  const inProgressTrendData = overviewData.length > 0 ? overviewData.map((d) => d['In Progress']) : [1, 1, 2, 2, 2, inProgressProj];
  const clientTrendData = [1, 1, 1, 2, 2, totalClients];

  return (
    <div className="space-y-2 lg:space-y-0 lg:flex lg:flex-col lg:gap-2 lg:h-full">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:flex-shrink-0">
        <StatCard
          title="Total Projects"
          value={totalProj}
          icon={Briefcase}
          color="blue"
          trend={`${completedProj} proyek selesai`}
          trendType="up"
          trendData={totalTrendData}
        />
        <StatCard
          title="Completed"
          value={completedProj}
          icon={CheckCircle2}
          color="green"
          trend={`${completedPct}% tingkat selesai`}
          trendType="up"
          trendData={completedTrendData}
        />
        <StatCard
          title="In Progress"
          value={inProgressProj}
          icon={RefreshCw}
          color="orange"
          trend={`${inProgressPct}% sedang berjalan`}
          trendType="up"
          trendData={inProgressTrendData}
        />
        <StatCard
          title="Total Clients"
          value={totalClients}
          icon={Users}
          color="purple"
          trend={`${totalClients} mitra aktif`}
          trendType="up"
          trendData={clientTrendData}
        />
      </div>

      {/* Row 2: Charts - mobile: fixed height, desktop: flex-1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:flex-1 lg:min-h-0">
        <div className="lg:col-span-2 lg:min-h-0">
          <ProjectOverviewChart data={overviewData} />
        </div>
        <div className="lg:min-h-0">
          <ProjectCategoryChart data={categoryData} />
        </div>
      </div>

      {/* Row 3: Secondary Widgets - mobile: fixed height, desktop: flex-1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:flex-1 lg:min-h-0">
        <div className="lg:min-h-0">
          <TopTechnologiesChart data={techData} />
        </div>
        <div className="lg:min-h-0">
          <ClientSatisfactionCard data={satisfactionData} />
        </div>
        <div className="lg:min-h-0">
          <RecentProjectsList projects={recentProjects} />
        </div>
      </div>

      {/* Row 4: Quick Actions */}
      <div className="lg:flex-shrink-0">
        <QuickActionsSection />
      </div>
    </div>
  );
};

export default DashboardPage;

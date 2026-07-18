import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as taskApi from '../../services/taskApi';
import * as projectApi from '../../services/projectApi';
import { useRole } from '../../hooks/useRole';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import {
  ChevronLeft, ChevronRight, X,
  Briefcase, CheckSquare, CalendarDays, Clock,
  Rocket, FlagTriangleRight, Flame, ArrowRight
} from 'lucide-react';

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// --- Event type config ---
const EVENT_CONFIG = {
  'project-start': {
    color: 'bg-blue-500',
    bar: 'bg-blue-500',
    pill: 'bg-blue-50 text-blue-700 border-l-2 border-blue-500',
    dot: 'bg-blue-500',
    icon: <Rocket className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />,
    label: 'Mulai Proyek',
  },
  'project-end': {
    color: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500',
    dot: 'bg-emerald-500',
    icon: <FlagTriangleRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />,
    label: 'Rilis Proyek',
  },
  'task-high': {
    color: 'bg-rose-500',
    bar: 'bg-rose-500',
    pill: 'bg-rose-50 text-rose-700 border-l-2 border-rose-500',
    dot: 'bg-rose-500',
    icon: <Flame className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />,
    label: 'Task High Priority',
  },
  'task-medium': {
    color: 'bg-amber-400',
    bar: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 border-l-2 border-amber-400',
    dot: 'bg-amber-400',
    icon: <CheckSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />,
    label: 'Task Deadline',
  },
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const { isClient } = useRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    if (isClient) navigate('/unauthorized');
  }, [isClient, navigate]);

  const loadData = useCallback(async () => {
    if (isClient) return;
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, projRes] = await Promise.all([
        taskApi.getTasks(),
        projectApi.getProjects()
      ]);
      setTasks(tasksRes);
      setProjects(projRes.projects || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat agenda kalender.');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  useEffect(() => { loadData(); }, [loadData]);

  // --- Calendar helpers ---
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  const formatDateString = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  const cells = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: prevMonthIndex, year: prevYear, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, month, year, isCurrentMonth: true });
  }
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let i = 1; i <= 42 - cells.length; i++) {
    cells.push({ day: i, month: nextMonthIndex, year: nextYear, isCurrentMonth: false });
  }

  const todayStr = formatDateString(
    new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
  );

  const getEventsForDate = (dateStr) => {
    const list = [];
    projects.forEach(p => {
      if (p.startDate === dateStr) {
        list.push({
          type: 'project-start',
          title: p.name,
          subtitle: `Mulai · ${p.client}`,
          projectName: p.name,
          client: p.client,
          description: `Tanggal dimulainya pengerjaan proyek ${p.name}.`,
        });
      }
      if (p.endDate === dateStr) {
        list.push({
          type: 'project-end',
          title: p.name,
          subtitle: `Rilis · ${p.client}`,
          projectName: p.name,
          client: p.client,
          description: `Batas akhir penyerahan / rilis produk proyek ${p.name}.`,
        });
      }
    });
    tasks.forEach(t => {
      if (t.dueDate === dateStr) {
        const relatedProj = projects.find(p => p.id === t.projectId);
        const evType = t.priority === 'High' ? 'task-high' : 'task-medium';
        list.push({
          type: evType,
          title: t.title,
          subtitle: `${t.priority} · ${relatedProj ? relatedProj.name : 'LEXA'}`,
          projectName: relatedProj ? relatedProj.name : 'Proyek LEXA',
          priority: t.priority,
          status: t.status,
          description: t.description || 'Tidak ada deskripsi detail.',
        });
      }
    });
    return list;
  };

  const handleCellClick = (dateStr, events) => {
    if (events.length > 0) {
      setSelectedDateStr(dateStr);
      setSelectedEvents(events);
    }
  };

  const parseFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(d)} ${MONTHS_ID[parseInt(m) - 1]} ${y}`;
  };

  // --- Stats for sidebar ---
  const currentMonthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthEvents = cells
    .filter(c => c.isCurrentMonth)
    .flatMap(c => getEventsForDate(formatDateString(c.year, c.month, c.day)));
  const projStartCount = monthEvents.filter(e => e.type === 'project-start').length;
  const projEndCount = monthEvents.filter(e => e.type === 'project-end').length;
  const taskHighCount = monthEvents.filter(e => e.type === 'task-high').length;
  const taskOtherCount = monthEvents.filter(e => e.type === 'task-medium').length;

  return (
    <div className="space-y-5 text-left">
      {/* ─── PAGE HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kalender Tim</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Visualisasi terpadu jadwal proyek dan deadline tugas seluruh tim.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-2 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
          >
            Hari Ini
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-slate-800 min-w-[130px] text-center">
            {MONTHS_ID[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader size="lg" />
          <p className="text-xs text-slate-400 font-semibold">Memuat kalender...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Alert type="error" message={error} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ─── MAIN COMPACT CALENDAR (Col Span 7) ─── */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">

            {/* Calendar Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800">
              {DAYS_SHORT.map((d, i) => (
                <div
                  key={d}
                  className={`py-2 text-center text-[10px] font-extrabold uppercase tracking-widest ${
                    i === 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
              {cells.map((cell, idx) => {
                const cellDateStr = formatDateString(cell.year, cell.month, cell.day);
                const cellEvents = getEventsForDate(cellDateStr);
                const isToday = cellDateStr === todayStr;
                const isWeekend = idx % 7 === 0;
                const hasEvents = cellEvents.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(cellDateStr, cellEvents)}
                    className={`min-h-[72px] p-1.5 flex flex-col transition-all group cursor-pointer
                      ${!cell.isCurrentMonth ? 'bg-slate-50/60 dark:bg-slate-900/30' : isWeekend ? 'bg-rose-50/10 dark:bg-rose-950/5' : 'bg-white dark:bg-slate-900'}
                      ${selectedDateStr === cellDateStr ? 'bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-850/50'}
                    `}
                  >
                    {/* Day Number */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-[10px] font-extrabold w-5.5 h-5.5 flex items-center justify-center rounded-full transition-all
                          ${isToday
                            ? 'bg-blue-600 text-white shadow-sm'
                            : cell.isCurrentMonth
                              ? isWeekend ? 'text-rose-400' : 'text-slate-650 dark:text-slate-300'
                              : 'text-slate-300 dark:text-slate-600'
                          }
                        `}
                      >
                        {cell.day}
                      </span>
                      {hasEvents && (
                        <div className="flex gap-0.5 mt-0.5">
                          {cellEvents.slice(0, 3).map((ev, i) => (
                            <span key={i} className={`w-1 h-1 rounded-full ${EVENT_CONFIG[ev.type]?.dot || 'bg-slate-400'}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Event Pills */}
                    <div className="mt-1 flex flex-col gap-0.5 flex-1">
                      {cellEvents.slice(0, 2).map((ev, evIdx) => {
                        const cfg = EVENT_CONFIG[ev.type] || {};
                        return (
                          <div
                            key={evIdx}
                            className={`text-[8px] font-bold py-0.5 px-1 rounded-r truncate leading-tight ${cfg.pill || ''}`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {cellEvents.length > 2 && (
                        <div className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 pl-1">
                          +{cellEvents.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── DETAILED SIDEBAR PANEL (Col Span 5) ─── */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col">
            
            {selectedDateStr ? (
              /* Selected Day's Task Details Card */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4 animate-fade-in text-left">
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Detail Agenda</p>
                    <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                      {parseFormattedDate(selectedDateStr)}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDateStr(null)}
                    className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all"
                    title="Kembali ke Ringkasan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {selectedEvents.length === 0 ? (
                    <div className="py-12 text-center text-slate-450 dark:text-slate-500 text-xs font-semibold">
                      Tidak ada agenda terjadwal untuk tanggal ini.
                    </div>
                  ) : (
                    selectedEvents.map((ev, idx) => {
                      const cfg = EVENT_CONFIG[ev.type] || {};
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                            ev.type === 'project-start' ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50' :
                            ev.type === 'project-end' ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50' :
                            ev.type === 'task-high' ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50' :
                            'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50'
                          }`}
                        >
                          <div className="mt-0.5">{cfg.icon}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-850 dark:text-slate-100 leading-snug">{ev.title}</p>
                            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">{ev.subtitle}</p>
                            {ev.priority && (
                              <div className="flex gap-1.5 mt-1.5">
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                  ev.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                  {ev.priority}
                                </span>
                                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-300">
                                  {ev.status}
                                </span>
                              </div>
                            )}
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-2 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed">
                              {ev.description}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* Month Summary Card */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Ringkasan Bulan Ini
                </p>
                <div className="space-y-2">
                  {[
                    { cfg: EVENT_CONFIG['project-start'], count: projStartCount, label: 'Mulai Proyek' },
                    { cfg: EVENT_CONFIG['project-end'],   count: projEndCount,   label: 'Rilis Proyek' },
                    { cfg: EVENT_CONFIG['task-high'],      count: taskHighCount,  label: 'Task High' },
                    { cfg: EVENT_CONFIG['task-medium'],    count: taskOtherCount, label: 'Task Lainnya' },
                  ].map(({ cfg, count, label }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
                        <span className="text-[10px] font-bold text-slate-650 dark:text-slate-300">{label}</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-100">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">Total Agenda</span>
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {projStartCount + projEndCount + taskHighCount + taskOtherCount}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Legend Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                Keterangan Warna
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(EVENT_CONFIG).map(cfg => (
                  <div key={cfg.label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
                    <span className="text-[9px] font-bold text-slate-650 dark:text-slate-350">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Nav Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-2">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                Navigasi Cepat
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Manajemen Task', path: '/tasks' },
                  { label: 'Daftar Proyek',  path: '/projects' },
                ].map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 text-left transition-all group"
                  >
                    <span className="text-[9px] font-bold text-slate-600 group-hover:text-blue-600">{label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-350 dark:text-slate-500 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

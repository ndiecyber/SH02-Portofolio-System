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
        <div className="flex gap-5 items-start">

          {/* ─── MAIN CALENDAR ─── */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Calendar Day Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAYS_SHORT.map((d, i) => (
                <div
                  key={d}
                  className={`py-3 text-center text-[10px] font-extrabold uppercase tracking-widest ${
                    i === 0 ? 'text-rose-400' : 'text-slate-400'
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
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
                    className={`min-h-[108px] p-2 flex flex-col transition-all group
                      ${hasEvents ? 'cursor-pointer' : ''}
                      ${!cell.isCurrentMonth ? 'bg-slate-50/60' : isWeekend ? 'bg-rose-50/20' : 'bg-white'}
                      ${hasEvents && cell.isCurrentMonth ? 'hover:bg-blue-50/30' : ''}
                    `}
                  >
                    {/* Day Number */}
                    <div className="flex items-start justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all
                          ${isToday
                            ? 'bg-blue-600 text-white shadow-sm'
                            : cell.isCurrentMonth
                              ? isWeekend ? 'text-rose-400' : 'text-slate-700'
                              : 'text-slate-300'
                          }
                        `}
                      >
                        {cell.day}
                      </span>
                      {hasEvents && (
                        <div className="flex gap-0.5 mt-0.5">
                          {cellEvents.slice(0, 3).map((ev, i) => (
                            <span key={i} className={`w-1.5 h-1.5 rounded-full ${EVENT_CONFIG[ev.type]?.dot || 'bg-slate-400'}`} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Event Pills */}
                    <div className="mt-1.5 flex flex-col gap-0.5 flex-1">
                      {cellEvents.slice(0, 2).map((ev, evIdx) => {
                        const cfg = EVENT_CONFIG[ev.type] || {};
                        return (
                          <div
                            key={evIdx}
                            className={`text-[9px] font-bold py-0.5 px-1.5 rounded-r-md truncate leading-tight ${cfg.pill || ''}`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {cellEvents.length > 2 && (
                        <div className="text-[8px] font-bold text-slate-400 pl-1">
                          +{cellEvents.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <div className="w-[210px] flex-shrink-0 space-y-3">

            {/* Month Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
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
                      <span className="text-[10px] font-semibold text-slate-600">{label}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">{count}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">Total Agenda</span>
                  <span className="text-xs font-extrabold text-blue-600">
                    {projStartCount + projEndCount + taskHighCount + taskOtherCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                Keterangan
              </p>
              {Object.values(EVENT_CONFIG).map(cfg => (
                <div key={cfg.label} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
                  <span className="text-[10px] font-semibold text-slate-600">{cfg.label}</span>
                </div>
              ))}
            </div>

            {/* Quick Nav */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                Navigasi Cepat
              </p>
              {[
                { label: 'Manajemen Task', path: '/tasks' },
                { label: 'Daftar Proyek',  path: '/projects' },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 text-left transition-all group"
                >
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-blue-600">{label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ─── EVENT DETAIL MODAL ─── */}
      {selectedDateStr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedDateStr(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Agenda</p>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {parseFormattedDate(selectedDateStr)}
                </h3>
                <p className="text-xs text-blue-200 mt-1 font-semibold">
                  {selectedEvents.length} agenda terjadwal
                </p>
              </div>
              <button
                onClick={() => setSelectedDateStr(null)}
                className="p-1.5 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedEvents.map((ev, idx) => {
                const cfg = EVENT_CONFIG[ev.type] || {};
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      ev.type === 'project-start' ? 'bg-blue-50/60 border-blue-100' :
                      ev.type === 'project-end' ? 'bg-emerald-50/60 border-emerald-100' :
                      ev.type === 'task-high' ? 'bg-rose-50/60 border-rose-100' :
                      'bg-amber-50/60 border-amber-100'
                    }`}
                  >
                    <div className="mt-0.5">{cfg.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-slate-800 leading-snug">{ev.title}</p>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{ev.subtitle}</p>
                      {ev.priority && (
                        <div className="flex gap-1.5 mt-1.5">
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                            ev.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {ev.priority}
                          </span>
                          <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {ev.status}
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-500 font-medium mt-2 leading-relaxed border-t border-slate-100/80 pt-2">
                        {ev.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => setSelectedDateStr(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-6 text-xs font-bold"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

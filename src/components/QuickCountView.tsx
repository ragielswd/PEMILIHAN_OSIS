import { useState, useEffect, useCallback, useRef } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LabelList, Legend,
} from 'recharts';
import {
  Maximize2, Minimize2, Vote as VoteIcon, TrendingUp, Crown,
  Moon, Sun, BarChart3, PieChart as PieIcon,
} from 'lucide-react';
import type { Candidate } from '@/types';
import { CHART_COLORS, SCHOOL_NAME, APP_TITLE, SCHOOL_LOGO_URL } from '@/constants';

interface QuickCountViewProps {
  candidates: Candidate[];
  getVoteCount: (candidateId: string) => number;
}

interface ChartDatum {
  name: string;
  nomorUrut: number;
  votes: number;
  percentage: number;
  color: string;
}

export default function QuickCountView({
  candidates,
  getVoteCount,
}: QuickCountViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [chartTab, setChartTab] = useState<'both' | 'bar' | 'pie'>('both');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  const sortedCandidates = [...candidates].sort((a, b) => a.nomorUrut - b.nomorUrut);
  const totalVotes = sortedCandidates.reduce((sum, c) => sum + getVoteCount(c.id), 0);

  const chartData: ChartDatum[] = sortedCandidates.map((c, i) => {
    const votes = getVoteCount(c.id);
    return {
      name: c.namaLengkap,
      nomorUrut: c.nomorUrut,
      votes,
      percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
    };
  });

  const leader = chartData.length > 0 ? [...chartData].sort((a, b) => b.votes - a.votes)[0] : null;

  const baseBg = darkMode ? 'bg-slate-900' : 'bg-slate-50';
  const cardBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-800';
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-500';
  const textMuted = darkMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div
      ref={containerRef}
      className={`${baseBg} min-h-screen transition-colors duration-300 ${
        isFullscreen ? 'p-6 lg:p-10' : ''
      }`}
    >
      {/* Toolbar */}
      <div className={`flex items-center justify-between gap-3 mb-6 ${isFullscreen ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'}`}>
        <div className="flex items-center gap-3">
          {isFullscreen && (
            <img
              src={SCHOOL_LOGO_URL}
              alt="Logo"
              className="w-10 h-10 rounded-lg object-contain bg-white p-0.5"
            />
          )}
          <div>
            <h1 className={`text-xl font-bold font-display ${textPrimary}`}>
              Quick Count
            </h1>
            {isFullscreen && (
              <p className={`text-sm ${textSecondary}`}>
                {SCHOOL_NAME} — {APP_TITLE}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`p-2.5 rounded-xl border transition-colors ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className={`p-2.5 rounded-xl border transition-colors ${
              darkMode
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`${isFullscreen ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'} space-y-6`}>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`${cardBg} border rounded-2xl p-5 flex items-center gap-4 transition-colors`}>
            <div className="w-12 h-12 rounded-xl bg-royal-50 flex items-center justify-center shrink-0">
              <VoteIcon className="w-6 h-6 text-royal-600" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold font-display ${textPrimary}`}>{totalVotes}</p>
              <p className={`text-sm ${textSecondary}`}>Total Suara Masuk</p>
            </div>
          </div>

          <div className={`${cardBg} border rounded-2xl p-5 flex items-center gap-4 transition-colors`}>
            <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-gold-500" />
            </div>
            <div className="min-w-0">
              <p className={`text-lg font-bold font-display ${textPrimary} truncate`}>
                {leader && leader.votes > 0
                  ? leader.name
                  : '—'}
              </p>
              <p className={`text-sm ${textSecondary}`}>Calon Ketua OSIS Unggul</p>
            </div>
          </div>
        </div>

        {/* Chart Tab Toggle */}
        {!isFullscreen && (
          <div className={`inline-flex p-1 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {[
              { key: 'both' as const, label: 'Semua', icon: BarChart3 },
              { key: 'bar' as const, label: 'Bar Chart', icon: BarChart3 },
              { key: 'pie' as const, label: 'Pie Chart', icon: PieIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setChartTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  chartTab === key
                    ? darkMode
                      ? 'bg-slate-700 text-white'
                      : 'bg-white text-slate-800 shadow-sm'
                    : darkMode
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Charts */}
        <div className={`grid gap-6 ${isFullscreen || chartTab === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Bar Chart */}
          {(chartTab === 'both' || chartTab === 'bar' || isFullscreen) && (
            <div className={`${cardBg} border rounded-2xl p-5 sm:p-6 transition-colors`}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-royal-400' : 'text-royal-600'}`} />
                <h3 className={`font-bold font-display ${textPrimary}`}>Perolehan Suara</h3>
              </div>
              <ResponsiveContainer width="100%" height={isFullscreen ? 350 : 280}>
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
                    axisLine={{ stroke: darkMode ? '#334155' : '#e2e8f0' }}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: darkMode ? '#1e293b' : '#f1f5f9' }}
                    contentStyle={{
                      background: darkMode ? '#0f172a' : '#fff',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: darkMode ? '#fff' : '#1e293b',
                    }}
                    formatter={((value: number, _name: string, item: { payload?: ChartDatum }) => {
                      const d = item.payload as ChartDatum;
                      const v = Number(value);
                      return [`${v} suara (${d.percentage.toFixed(1)}%)`, d.name];
                    }) as never}
                    labelFormatter={(label: unknown) => String(label)}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 0, 0]} maxBarSize={80}>
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                    <LabelList
                      dataKey="votes"
                      position="top"
                      style={{ fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 13, fontWeight: 700 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          {(chartTab === 'both' || chartTab === 'pie' || isFullscreen) && (
            <div className={`${cardBg} border rounded-2xl p-5 sm:p-6 transition-colors`}>
              <div className="flex items-center gap-2 mb-4">
                <PieIcon className={`w-5 h-5 ${darkMode ? 'text-royal-400' : 'text-royal-600'}`} />
                <h3 className={`font-bold font-display ${textPrimary}`}>Persentase Suara</h3>
              </div>
              <ResponsiveContainer width="100%" height={isFullscreen ? 350 : 280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="votes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={isFullscreen ? 120 : 100}
                    innerRadius={50}
                    paddingAngle={2}
                    label={(entry: { payload?: ChartDatum }) => {
                      const d = entry.payload;
                      if (!d || !d.votes || d.votes <= 0) return '';
                      return `${d.percentage.toFixed(1)}%`;
                    }}
                    labelLine={false}
                  >
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#0f172a' : '#fff',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: darkMode ? '#fff' : '#1e293b',
                    }}
                    formatter={((value: number, _name: string, item: { payload?: ChartDatum }) => {
                      const d = item.payload as ChartDatum;
                      const v = Number(value);
                      return [`${v} suara (${d.percentage.toFixed(1)}%)`, d.name];
                    }) as never}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: darkMode ? '#cbd5e1' : '#475569', fontSize: 12 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Detailed Results Table */}
        <div className={`${cardBg} border rounded-2xl overflow-hidden transition-colors`}>
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className={`font-bold font-display ${textPrimary}`}>Detail Perolehan Suara</h3>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {chartData.length === 0 ? (
              <p className={`p-6 text-center ${textMuted}`}>Belum ada kandidat.</p>
            ) : (
              chartData
                .sort((a, b) => b.votes - a.votes)
                .map((d, i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div
                      className="w-2 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${textPrimary}`}>
                          {d.name}
                        </span>
                        {i === 0 && d.votes > 0 && (
                          <Crown className="w-4 h-4 text-gold-500 shrink-0" />
                        )}
                      </div>
                      <div className="mt-1.5 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-extrabold font-display ${textPrimary}`}>
                        {d.votes}
                      </p>
                      <p className={`text-xs ${textMuted}`}>{d.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Footer info for fullscreen */}
        {isFullscreen && (
          <div className={`text-center pt-4 ${textMuted}`}>
            <p className="text-sm">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Data diperbarui secara real-time — {SCHOOL_NAME}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

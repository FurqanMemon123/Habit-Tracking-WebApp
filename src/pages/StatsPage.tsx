import { useState, useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useHabits } from '../hooks/useHabits';
import { useHabitLogs } from '../hooks/useHabitLogs';
import Card from '../components/ui/Card';
import {
  Loader2,
  TrendingUp,
  Flame,
  Award,
  BarChart3,
} from 'lucide-react';

const PERIODS = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

export default function StatsPage() {
  const [period, setPeriod] = useState(30);
  const { habits, loading: habitsLoading } = useHabits();

  // Memoize dates so useHabitLogs doesn't get new object refs each render
  const rangeStart = useMemo(() => subDays(new Date(), 90), []);
  const rangeEnd = useMemo(() => new Date(), []);

  const { logs, loading: logsLoading, getStreak, getCompletionRate } = useHabitLogs(
    rangeStart,
    rangeEnd
  );

  const loading = habitsLoading || logsLoading;

  // Daily completion data for the chart
  const chartData = useMemo(() => {
    const end = new Date();
    const start = subDays(end, period - 1);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = logs.filter((l) => l.completed_date === dateStr).length;
      const total = habits.length;
      return {
        date: format(day, 'MMM d'),
        shortDate: format(day, 'd'),
        completed,
        total,
        rate: total > 0 ? (completed / total) * 100 : 0,
      };
    });
  }, [logs, habits, period]);

  const maxCompleted = Math.max(...chartData.map((d) => d.completed), 1);

  // Overall stats
  const overallRate = habits.length > 0
    ? habits.reduce((sum, h) => sum + getCompletionRate(h.id, period), 0) / habits.length
    : 0;

  const bestStreakValue = habits.reduce((max, h) => Math.max(max, getStreak(h.id)), 0);
  const bestStreakHabit = habits.find((h) => getStreak(h.id) === bestStreakValue);

  const totalCompletions = logs.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Statistics</h1>
          <p className="text-slate-400 mt-1">Your habit performance insights</p>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                period === p.days
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{Math.round(overallRate)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Best Streak</p>
              <p className="text-2xl font-bold text-white">{bestStreakValue} days</p>
              {bestStreakHabit && (
                <p className="text-xs text-slate-500 truncate">{bestStreakHabit.title}</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Completions</p>
              <p className="text-2xl font-bold text-white">{totalCompletions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily completion chart */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Daily Completions</h3>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Create habits to see your stats here.</p>
          </div>
        ) : (
          <div className="flex items-end gap-[2px] h-40 overflow-x-auto pb-6 relative">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 min-w-[6px] flex flex-col items-center group relative">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-slate-700">
                    <p className="font-medium">{d.date}</p>
                    <p className="text-slate-400">{d.completed}/{d.total} completed</p>
                    <p className="text-indigo-400">{Math.round(d.rate)}%</p>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${(d.completed / maxCompleted) * 100}%`,
                    minHeight: d.completed > 0 ? '4px' : '0px',
                    background:
                      d.rate === 100
                        ? 'linear-gradient(to top, #4F46E5, #7C3AED)'
                        : d.rate >= 50
                        ? 'rgba(79, 70, 229, 0.6)'
                        : d.rate > 0
                        ? 'rgba(79, 70, 229, 0.3)'
                        : 'transparent',
                  }}
                />

                {/* Date label (show every few) */}
                {(period <= 7 || i % Math.ceil(period / 15) === 0) && (
                  <span className="absolute -bottom-5 text-[9px] text-slate-600 whitespace-nowrap">
                    {d.shortDate}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Per-habit breakdown */}
      <Card>
        <h3 className="font-semibold text-white mb-4">Habit Breakdown</h3>
        {habits.length === 0 ? (
          <p className="text-sm text-slate-500">No habits to show.</p>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => {
              const rate = getCompletionRate(habit.id, period);
              const streak = getStreak(habit.id);

              return (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="text-sm font-medium text-white">{habit.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      {streak > 0 && (
                        <span className="text-orange-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" />
                          {streak}d
                        </span>
                      )}
                      <span className="text-slate-400">{Math.round(rate)}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${rate}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

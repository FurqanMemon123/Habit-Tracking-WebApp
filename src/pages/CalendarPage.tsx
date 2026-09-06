import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  getDay,
} from 'date-fns';
import { useHabits } from '../hooks/useHabits';
import { useHabitLogs } from '../hooks/useHabitLogs';
import Card from '../components/ui/Card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);

  const rangeStart = useMemo(() => subMonths(monthStart, 1), [monthStart]);
  const rangeEnd = useMemo(() => addMonths(monthEnd, 1), [monthEnd]);

  const { habits, loading: habitsLoading } = useHabits();
  const { loading: logsLoading, getCompletionsForDate, isCompleted } = useHabitLogs(
    rangeStart,
    rangeEnd
  );

  const days = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd]);

  // Pad start
  const startPadding = getDay(monthStart);

  const loading = habitsLoading || logsLoading;

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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Calendar</h1>
        <p className="text-slate-400 mt-1">Track your progress over time</p>
      </div>

      <Card>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding cells */}
          {Array.from({ length: startPadding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {days.map((day) => {
            const completions = getCompletionsForDate(day);
            const totalHabits = habits.length;
            const completionRatio = totalHabits > 0 ? completions.length / totalHabits : 0;
            const today = isToday(day);
            const selected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

            // Heatmap color intensity
            let bgClass = 'bg-transparent hover:bg-slate-800/50';
            if (completionRatio > 0 && completionRatio < 0.33) bgClass = 'bg-indigo-500/15';
            else if (completionRatio >= 0.33 && completionRatio < 0.66) bgClass = 'bg-indigo-500/30';
            else if (completionRatio >= 0.66 && completionRatio < 1) bgClass = 'bg-indigo-500/50';
            else if (completionRatio === 1 && totalHabits > 0) bgClass = 'bg-indigo-500/80';

            return (
              <button
                key={format(day, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-200 ${bgClass} ${
                  today ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-900' : ''
                } ${selected ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''} ${
                  isSameMonth(day, currentMonth) ? 'text-white' : 'text-slate-600'
                }`}
              >
                <span className="font-medium">{format(day, 'd')}</span>
                {completions.length > 0 && (
                  <span className="text-[10px] text-indigo-300 mt-0.5">
                    {completions.length}/{totalHabits}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500">Less</span>
          <div className="w-4 h-4 rounded bg-slate-800" />
          <div className="w-4 h-4 rounded bg-indigo-500/15" />
          <div className="w-4 h-4 rounded bg-indigo-500/30" />
          <div className="w-4 h-4 rounded bg-indigo-500/50" />
          <div className="w-4 h-4 rounded bg-indigo-500/80" />
          <span className="text-xs text-slate-500">More</span>
        </div>
      </Card>

      {/* Selected day detail */}
      {selectedDate && (
        <Card>
          <h3 className="text-sm font-semibold text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          {habits.length === 0 ? (
            <p className="text-sm text-slate-500">No habits to show.</p>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => {
                const done = isCompleted(habit.id, selectedDate);
                return (
                  <div key={habit.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        done ? 'border-transparent' : 'border-slate-600'
                      }`}
                      style={done ? { backgroundColor: habit.color } : undefined}
                    >
                      {done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${done ? 'text-white' : 'text-slate-500'}`}>
                      {habit.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

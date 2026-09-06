import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { HabitLog } from '../types/database';
import { format, subDays, eachDayOfInterval, parseISO, differenceInCalendarDays } from 'date-fns';

export function useHabitLogs(startDate?: Date, endDate?: Date) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoize date strings to prevent infinite re-render loops
  // when callers pass `new Date()` (which creates a new object each render)
  const fromStr = useMemo(
    () => (startDate ? format(startDate, 'yyyy-MM-dd') : format(subDays(new Date(), 90), 'yyyy-MM-dd')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate?.getTime()]
  );
  const toStr = useMemo(
    () => (endDate ? format(endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endDate?.getTime()]
  );

  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('completed_date', fromStr)
      .lte('completed_date', toStr)
      .order('completed_date', { ascending: true });

    if (!error) {
      setLogs(data || []);
    }
    setLoading(false);
  }, [user, fromStr, toStr]);

  const toggleCompletion = useCallback(
    async (habitId: string, date: Date) => {
      if (!user) return;
      const dateStr = format(date, 'yyyy-MM-dd');

      const existing = logs.find(
        (l) => l.habit_id === habitId && l.completed_date === dateStr
      );

      if (existing) {
        // Remove log
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('id', existing.id);

        if (!error) {
          setLogs((prev) => prev.filter((l) => l.id !== existing.id));
        }
      } else {
        // Insert log
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            completed_date: dateStr,
          })
          .select()
          .single();

        if (!error && data) {
          setLogs((prev) => [...prev, data]);
        }
      }
    },
    [user, logs]
  );

  const isCompleted = useCallback(
    (habitId: string, date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return logs.some((l) => l.habit_id === habitId && l.completed_date === dateStr);
    },
    [logs]
  );

  const getCompletionsForDate = useCallback(
    (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return logs.filter((l) => l.completed_date === dateStr);
    },
    [logs]
  );

  const getStreak = useCallback(
    (habitId: string) => {
      const habitLogs = logs
        .filter((l) => l.habit_id === habitId)
        .map((l) => l.completed_date)
        .sort()
        .reverse();

      if (habitLogs.length === 0) return 0;

      let streak = 0;
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      // Start from today or yesterday
      const startFrom = habitLogs.includes(today) ? today : habitLogs.includes(yesterday) ? yesterday : null;
      if (!startFrom) return 0;

      let currentDate = parseISO(startFrom);
      for (const dateStr of habitLogs) {
        const logDate = parseISO(dateStr);
        const diff = differenceInCalendarDays(currentDate, logDate);
        if (diff === 0) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else if (diff > 0) {
          break;
        }
      }

      return streak;
    },
    [logs]
  );

  const getCompletionRate = useCallback(
    (habitId: string, days: number) => {
      const end = new Date();
      const start = subDays(end, days - 1);
      const interval = eachDayOfInterval({ start, end });

      const completedDays = interval.filter((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return logs.some((l) => l.habit_id === habitId && l.completed_date === dateStr);
      });

      return interval.length > 0 ? (completedDays.length / interval.length) * 100 : 0;
    },
    [logs]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refetch: fetchLogs,
    toggleCompletion,
    isCompleted,
    getCompletionsForDate,
    getStreak,
    getCompletionRate,
  };
}

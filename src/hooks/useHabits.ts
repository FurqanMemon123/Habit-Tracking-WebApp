import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Habit, HabitInsert, HabitUpdate } from '../types/database';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setHabits(data || []);
    }
    setLoading(false);
  }, [user]);

  const createHabit = useCallback(
    async (habit: HabitInsert) => {
      if (!user) return null;
      const { data, error: err } = await supabase
        .from('habits')
        .insert({ ...habit, user_id: user.id })
        .select()
        .single();

      if (err) {
        setError(err.message);
        return null;
      }
      setHabits((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  const updateHabit = useCallback(
    async (id: string, updates: HabitUpdate) => {
      const { data, error: err } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (err) {
        setError(err.message);
        return null;
      }
      setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
      return data;
    },
    []
  );

  const deleteHabit = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('habits').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return false;
    }
    setHabits((prev) => prev.filter((h) => h.id !== id));
    return true;
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return { habits, loading, error, refetch: fetchHabits, createHabit, updateHabit, deleteHabit };
}

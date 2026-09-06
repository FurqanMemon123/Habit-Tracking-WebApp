export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: string;
  target_days_per_week: number;
  color: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at: string;
}

export type HabitInsert = Omit<Habit, 'id' | 'created_at' | 'user_id'>;
export type HabitUpdate = Partial<HabitInsert>;

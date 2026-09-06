import { format } from 'date-fns';
import { useHabits } from '../hooks/useHabits';
import { useHabitLogs } from '../hooks/useHabitLogs';
import Card from '../components/ui/Card';
import {
  CheckCircle2,
  Circle,
  Flame,
  Target,
  TrendingUp,
  Zap,
  Loader2,
} from 'lucide-react';

export default function Dashboard() {
  const { habits, loading: habitsLoading } = useHabits();
  const { loading: logsLoading, toggleCompletion, isCompleted, getStreak, getCompletionRate } =
    useHabitLogs();

  const today = new Date();
  const completedToday = habits.filter((h) => isCompleted(h.id, today)).length;
  const totalHabits = habits.length;
  const overallRate =
    totalHabits > 0
      ? habits.reduce((sum, h) => sum + getCompletionRate(h.id, 7), 0) / totalHabits
      : 0;
  const bestStreak = habits.reduce((max, h) => Math.max(max, getStreak(h.id)), 0);

  if (habitsLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Good {getTimeOfDay()}, <span className="text-indigo-400">Champion</span> 🚀
        </h1>
        <p className="text-slate-400 mt-1">{format(today, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Total Habits"
          value={totalHabits}
          color="text-indigo-400"
          bgColor="bg-indigo-500/10"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Done Today"
          value={`${completedToday}/${totalHabits}`}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Week Rate"
          value={`${Math.round(overallRate)}%`}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          label="Best Streak"
          value={`${bestStreak}d`}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
        />
      </div>

      {/* Today's habits */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Today's Habits
        </h2>

        {habits.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-slate-400">No habits yet. Create your first habit to get started!</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const completed = isCompleted(habit.id, today);
              const streak = getStreak(habit.id);
              const weekRate = getCompletionRate(habit.id, 7);

              return (
                <Card key={habit.id} accentColor={habit.color}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleCompletion(habit.id, today)}
                      className="flex-shrink-0 transition-all duration-300 hover:scale-110"
                    >
                      {completed ? (
                        <CheckCircle2
                          className="w-7 h-7 transition-all duration-300"
                          style={{ color: habit.color }}
                        />
                      ) : (
                        <Circle className="w-7 h-7 text-slate-600 hover:text-slate-400 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium transition-all duration-300 ${
                          completed ? 'text-slate-500 line-through' : 'text-white'
                        }`}
                      >
                        {habit.title}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-slate-500 truncate">{habit.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-4 h-4" />
                          <span>{streak}</span>
                        </div>
                      )}
                      <div className="hidden sm:block w-24">
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${weekRate}%`,
                              backgroundColor: habit.color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{Math.round(weekRate)}% this week</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${bgColor} ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ColorPicker from '../components/ui/ColorPicker';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ListChecks,
} from 'lucide-react';
import type { HabitInsert } from '../types/database';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

export default function HabitsPage() {
  const { habits, loading, createHabit, updateHabit, deleteHabit } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [targetDays, setTargetDays] = useState(7);
  const [color, setColor] = useState('#4F46E5');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setTargetDays(7);
    setColor('#4F46E5');
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (habit: HabitInsert & { id: string }) => {
    setTitle(habit.title);
    setDescription(habit.description || '');
    setFrequency(habit.frequency);
    setTargetDays(habit.target_days_per_week);
    setColor(habit.color);
    setEditingId(habit.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const habitData: HabitInsert = {
      title,
      description: description || null,
      frequency,
      target_days_per_week: targetDays,
      color,
    };

    if (editingId) {
      await updateHabit(editingId, habitData);
    } else {
      await createHabit(habitData);
    }

    setSaving(false);
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteHabit(id);
    setDeleting(null);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Habits</h1>
          <p className="text-slate-400 mt-1">Manage and organize your habits</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          New Habit
        </Button>
      </div>

      {/* Habit list */}
      {habits.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 mb-4">
              <ListChecks className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No habits yet</h3>
            <p className="text-slate-400 mb-6">Create your first habit to start tracking your progress</p>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" />
              Create Habit
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {habits.map((habit) => (
            <Card key={habit.id} accentColor={habit.color}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="font-semibold text-white truncate">{habit.title}</h3>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{habit.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 capitalize">
                      {habit.frequency}
                    </span>
                    {habit.frequency === 'custom' && (
                      <span className="text-xs text-slate-500">
                        {habit.target_days_per_week} days/week
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => openEdit(habit)}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-all duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    disabled={deleting === habit.id}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                  >
                    {deleting === habit.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingId ? 'Edit Habit' : 'Create New Habit'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="habit-title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Meditation"
            required
          />

          <div>
            <label htmlFor="habit-desc" className="block text-sm font-medium text-slate-300 mb-1.5">
              Description (optional)
            </label>
            <textarea
              id="habit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this habit matters to you..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Frequency</label>
            <div className="flex gap-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequency(opt.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    frequency === opt.value
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'custom' && (
            <Input
              id="target-days"
              label="Target days per week"
              type="number"
              min={1}
              max={7}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
            />
          )}

          <ColorPicker value={color} onChange={setColor} />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

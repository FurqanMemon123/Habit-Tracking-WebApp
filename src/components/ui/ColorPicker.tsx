const COLORS = [
  '#4F46E5', // Indigo
  '#7C3AED', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F43F5E', // Rose
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
              value === color
                ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                : 'hover:ring-1 hover:ring-slate-600'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

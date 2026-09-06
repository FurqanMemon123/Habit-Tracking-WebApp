import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

export default function Card({ children, className = '', accentColor }: CardProps) {
  return (
    <div
      className={`bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-lg transition-all duration-300 hover:border-slate-700 ${className}`}
      style={accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : undefined}
    >
      {children}
    </div>
  );
}

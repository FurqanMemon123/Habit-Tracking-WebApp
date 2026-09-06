# HabitFlow — Habit Tracking Application

## Overview
HabitFlow is a full-stack habit tracking web application that helps users build and maintain positive habits. Users can create habits, mark daily completions, view calendar heatmaps, and track statistics over time.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Vite + React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| **Icons** | `lucide-react` |
| **Backend** | Supabase (Auth + PostgreSQL + RLS) |
| **Routing** | `react-router-dom` v7 |
| **Date Utilities** | `date-fns` |

## Project Structure

```
Assignment/
├── index.html                     # HTML entry point with Inter font
├── vite.config.ts                 # Vite config with React + Tailwind plugins
├── .env                           # Supabase environment variables
├── supabase/
│   └── migration.sql              # SQL migration for Supabase SQL Editor
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Router + AuthProvider setup
│   ├── index.css                  # Tailwind import + custom animations
│   ├── lib/
│   │   └── supabase.ts            # Supabase client singleton
│   ├── types/
│   │   └── database.ts            # TypeScript interfaces for DB tables
│   ├── contexts/
│   │   └── AuthContext.tsx         # Auth state management (session, signIn/Up/Out)
│   ├── hooks/
│   │   ├── useHabits.ts           # CRUD operations for habits
│   │   └── useHabitLogs.ts        # Log toggling, streaks, completion rates
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx      # Sign-in / Sign-up form
│   │   │   └── ProtectedRoute.tsx # Auth guard wrapper
│   │   ├── layout/
│   │   │   └── AppLayout.tsx      # Sidebar + mobile nav shell
│   │   └── ui/
│   │       ├── Button.tsx         # Multi-variant button
│   │       ├── Card.tsx           # Glassmorphism card
│   │       ├── ColorPicker.tsx    # Preset color selector
│   │       ├── Input.tsx          # Styled input with error state
│   │       └── Modal.tsx          # Animated overlay modal
│   └── pages/
│       ├── Dashboard.tsx          # Today's habits, stats, progress bars
│       ├── HabitsPage.tsx         # CRUD management with modal forms
│       ├── CalendarPage.tsx       # Monthly heatmap calendar
│       └── StatsPage.tsx          # Charts and habit breakdowns
└── AGENTS.md                      # This file
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file in the project root (already included):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the SQL migration:**
   - Open your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy and paste the contents of `supabase/migration.sql`
   - Click **Run**

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5173`

## Key Features

### Authentication
- Email/password sign-up and sign-in via Supabase Auth
- Session persistence with automatic token refresh
- Protected routes with redirect to login

### Habit Management
- Create, edit, and delete habits
- Custom colors, frequency settings, and descriptions
- Visual card grid with colored accents

### Dashboard
- Today's habit checklist with one-tap completion
- Streak counters (🔥) for consecutive days
- Weekly progress bars per habit
- Summary stat cards (total, completed, rate, best streak)

### Calendar
- Monthly heatmap view showing completion density
- Color-coded cells (5 intensity levels)
- Click any day to see which habits were completed
- Navigate between months

### Statistics
- Switchable period (7 / 30 / 90 days)
- Daily completion bar chart with hover tooltips
- Per-habit breakdown with progress bars
- Best streak and total completion metrics

## Database Schema

### `habits` table
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| title | text | Habit name |
| description | text | Optional description |
| frequency | text | 'daily', 'weekly', or 'custom' |
| target_days_per_week | int | Target (1–7) |
| color | text | Hex color code |
| created_at | timestamptz | Creation timestamp |

### `habit_logs` table
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| habit_id | uuid | FK → habits |
| user_id | uuid | FK → auth.users |
| completed_date | date | The date completed |
| created_at | timestamptz | Log timestamp |

Both tables have **Row Level Security (RLS)** enabled so users can only access their own data.

## Design Principles

- **Dark theme** with slate/zinc backgrounds
- **Glassmorphism** cards with backdrop blur
- **Gradient accents** (indigo → purple)
- **Micro-animations** on interactions
- **Mobile-first** responsive design
- **Inter** font from Google Fonts

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Deployment

Build the production bundle:
```bash
npm run build
```

The output in `dist/` can be deployed to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.).

For SPA routing, ensure your hosting provider redirects all paths to `index.html`.

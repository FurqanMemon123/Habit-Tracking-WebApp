# HabitFlow 🚀

A modern, full-stack habit tracking web application that helps you build and maintain positive habits. Track daily completions, visualize progress with calendar heatmaps, and monitor your streaks and statistics over time.

![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB-3FCF8E?logo=supabase&logoColor=white)

---

## ✨ Features

- **🔐 Authentication** — Email/password sign-up & sign-in via Supabase Auth with session persistence
- **📋 Dashboard** — Today's habit checklist with one-tap completion, streak counters, and weekly progress bars
- **✏️ Habit Management** — Create, edit, and delete habits with custom colors, frequencies, and descriptions
- **📅 Calendar Heatmap** — Monthly view showing completion density with 5 intensity levels
- **📊 Statistics** — Switchable period charts (7/30/90 days), per-habit breakdowns, and best streak tracking
- **📱 Responsive** — Mobile-first design with collapsible sidebar navigation
- **🌙 Dark Theme** — Premium glassmorphism UI with gradient accents and micro-animations

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite` plugin) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend** | [Supabase](https://supabase.com/) (Auth + PostgreSQL + RLS) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Date Utilities** | [date-fns](https://date-fns.org/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Assignment
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the Database Migration

1. Open your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of [`supabase/migration.sql`](supabase/migration.sql)
4. Click **Run**

This creates the `habits` and `habit_logs` tables with Row Level Security (RLS) policies.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
├── index.html                         # HTML entry point (Inter font, SEO meta)
├── vite.config.ts                     # Vite + React + Tailwind plugins
├── .env                               # Supabase environment variables
├── supabase/
│   └── migration.sql                  # SQL schema + RLS policies
├── src/
│   ├── main.tsx                       # React entry point
│   ├── App.tsx                        # Router + AuthProvider
│   ├── index.css                      # Tailwind + custom animations
│   ├── lib/
│   │   └── supabase.ts                # Supabase client singleton
│   ├── types/
│   │   └── database.ts                # TypeScript interfaces
│   ├── contexts/
│   │   └── AuthContext.tsx             # Auth state management
│   ├── hooks/
│   │   ├── useHabits.ts               # CRUD operations
│   │   └── useHabitLogs.ts            # Logs, streaks, completion rates
│   ├── components/
│   │   ├── auth/                      # LoginPage, ProtectedRoute
│   │   ├── layout/                    # AppLayout (sidebar + mobile nav)
│   │   └── ui/                        # Button, Card, Input, Modal, ColorPicker
│   └── pages/
│       ├── Dashboard.tsx              # Today's habits + stats
│       ├── HabitsPage.tsx             # CRUD management
│       ├── CalendarPage.tsx           # Monthly heatmap
│       └── StatsPage.tsx              # Charts + breakdowns
└── AGENTS.md                          # Detailed project documentation
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint / Oxlint |

---

## 🗄 Database Schema

### `habits`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `auth.users` |
| `title` | `text` | Habit name |
| `description` | `text` | Optional description |
| `frequency` | `text` | `daily`, `weekly`, or `custom` |
| `target_days_per_week` | `int` | Target (1–7) |
| `color` | `text` | Hex color code |
| `created_at` | `timestamptz` | Creation timestamp |

### `habit_logs`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `habit_id` | `uuid` | FK → `habits` |
| `user_id` | `uuid` | FK → `auth.users` |
| `completed_date` | `date` | The date completed |
| `created_at` | `timestamptz` | Log timestamp |

Both tables have **Row Level Security** enabled — users can only access their own data.

---

## 🚢 Deployment

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting provider:

- [Vercel](https://vercel.com/) — `vercel deploy`
- [Netlify](https://netlify.com/) — drag & drop or CLI
- [Cloudflare Pages](https://pages.cloudflare.com/)

> **Note:** For SPA routing, configure your host to redirect all paths to `index.html`.

---

## 📄 License

This project is for educational / assignment purposes.

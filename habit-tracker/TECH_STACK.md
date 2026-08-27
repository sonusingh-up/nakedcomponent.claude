# Tech Stack & Project Overview

This document outlines the core technologies, frameworks, tools, and key features that power the Habit Tracker application.

## 🚀 Core Framework & Technologies

- **[Nuxt 3](https://nuxt.com/)**: The core Meta-Framework built on top of Vue 3. It provides file-based routing, server-side rendering (SSR), auto-imports for composables and components, and a highly optimized build process using Vite.
- **[Vue 3 (Composition API)](https://vuejs.org/)**: Used for building the reactive user interfaces. Features like `ref`, `computed`, and `watch` are heavily used to manage state, calculate streaks, and build dynamic components.
- **[TypeScript](https://www.typescriptlang.org/)**: The entire application is strongly typed, ensuring type safety across API calls, UI components, and state management.

## 🎨 UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework used for all layout, spacing, typography, and responsive design. It allows for rapid prototyping and heavily customized, premium styling directly in the markup.
- **[Nuxt UI](https://ui.nuxt.com/)**: A fully styled UI component library for Nuxt that provides accessible, customizable base components (like Toasts, Skeleton loaders, and Icons).
- **[Lucide & Tabler Icons](https://lucide.dev/)**: Scalable SVG icons used throughout the app (categories, freeze buttons, navigation) via the Nuxt UI `@nuxt/ui` icon integration.

## 💾 Backend & Database

- **[Supabase](https://supabase.com/)**: An open-source Firebase alternative providing the complete backend infrastructure:
  - **PostgreSQL**: The robust, relational database storing all user data, habits, logs, and freeze banks.
  - **Auth**: Manages secure user authentication and sessions.
  - **PostgREST**: Automatically exposes our database schema as a secure, fast REST API.
  - **Row Level Security (RLS)**: Secures the database at the row level so users can only ever query and modify their own habit data.
  - **Supabase JS Client**: The `@supabase/supabase-js` library is used inside Nuxt composables (`useHabits`, `useHabitLogs`) to fetch and mutate data.

## 🧠 Key Application Features

1. **Intelligent Habit Discovery & Tracking**
   - A swipeable deck UI (`/discover`) allowing users to easily adopt global habits categorized by type (Fitness, Nutrition, etc.).
   - Custom habit creation supporting unique names, colors, and icons.

2. **Advanced Streak Engine**
   - Accurate, timezone-aware tracking of "Current Streak" and "Longest Streak".
   - Seamlessly managed via PostgreSQL database triggers and client-side computed properties.

3. **Retroactive Streak Freezes**
   - A highly complex streak-protection mechanism.
   - Users are granted 2 base "Freeze Slots" per month, tracked in a `freeze_banks` table.
   - Hitting a 7-day continuous streak automatically unlocks a 3rd "Bonus" freeze slot via milestone detection.
   - When a user misses a day, the habit enters an "At Risk" state for 24 hours. The user can manually spend a freeze to retroactively save their streak.

4. **Deep Analytics & Heatmaps**
   - **Global Stats**: A 70-day rolling dot-matrix heatmap displaying overall activity frequency.
   - **Habit-Specific History**: A 28-day rolling matrix on the `/track/[id]` page visually representing completed, missed, and frozen days.
   - **Freeze History Log**: A detailed ledger showing exactly when and why freezes were consumed for a given habit.

## 🛠️ Architecture & Project Structure

- `app/components/`: Reusable UI elements (`HabitCard`, `FreezeBank`, `HabitSwipeDeck`).
- `app/composables/`: Shared business logic and Supabase API wrappers (`useHabits`, `useHabitLogs`).
- `app/pages/`: File-based routes mapping to URLs (`/`, `/discover`, `/stats`, `/track/[id]`).
- `supabase/migrations/`: SQL files tracking database schema evolution, including tables for `habit_logs`, `habit_streaks`, and `freeze_banks`.

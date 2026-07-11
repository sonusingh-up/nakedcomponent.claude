// Shared domain types mirroring the Supabase schema (see supabase/migrations).

export type HabitCategory =
  | 'fitness'
  | 'nutrition'
  | 'mindfulness'
  | 'sleep'
  | 'hydration'
  | 'productivity'

export type FrequencyType = 'daily' | 'weekly' | 'custom'

export type Mood = 'great' | 'good' | 'okay' | 'bad'

export type EntryType = 'text' | 'audio'

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** A predefined habit from the public catalog. */
export interface Habit {
  id: string
  name: string
  description: string | null
  category: HabitCategory
  icon: string
  color: string
  social_proof_count: number
  frequency_type: FrequencyType
  sort_order: number
  is_active: boolean
  created_at: string
}

/** A habit a user has adopted, optionally joined with its catalog habit + streak. */
export interface UserHabit {
  id: string
  user_id: string
  habit_id: string
  adopted_at: string
  is_active: boolean
  custom_name: string | null
  target_count: number
  target_unit: string
  sort_order: number
  // Joined relations (populated by select queries)
  habit?: Habit
  streak?: HabitStreak
  todayLog?: HabitLog | null
}

export interface HabitLog {
  id: string
  user_id: string
  user_habit_id: string
  log_date: string
  status: 'completed' | 'missed' | 'frozen'
  count: number
  notes: string | null
  mood: Mood | null
  logged_at: string
}

export interface HabitStreak {
  id: string
  user_habit_id: string
  current_streak: number
  longest_streak: number
  last_logged_date: string | null
  updated_at: string
}

export interface Reminder {
  id: string
  user_id: string
  user_habit_id: string
  remind_time: string
  remind_days: WeekDay[]
  is_enabled: boolean
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  user_habit_id: string | null
  entry_type: EntryType
  title: string | null
  body: string | null
  audio_url: string | null
  audio_duration: number | null
  image_url: string | null
  tags: string[] | null
  mood: Mood | null
  created_at: string
}

/** Display metadata for each category — colors map to brand palette tints. */
export const CATEGORY_META: Record<
  HabitCategory,
  { label: string; tint: string; icon: string }
> = {
  fitness: { label: 'Fitness', tint: 'var(--color-rose)', icon: 'i-lucide-dumbbell' },
  nutrition: { label: 'Nutrition', tint: 'var(--color-mint)', icon: 'i-lucide-apple' },
  mindfulness: { label: 'Mindfulness', tint: 'var(--color-sky)', icon: 'i-lucide-brain' },
  sleep: { label: 'Sleep', tint: 'var(--color-sky)', icon: 'i-lucide-moon' },
  hydration: { label: 'Hydration', tint: 'var(--color-sky)', icon: 'i-lucide-glass-water' },
  productivity: { label: 'Productivity', tint: 'var(--color-butter)', icon: 'i-lucide-target' },
}

export interface FreezeBank {
  id: string
  user_id: string
  month_start: string
  base_used: number
  bonus_earned: boolean
  bonus_used: boolean
  updated_at: string
}


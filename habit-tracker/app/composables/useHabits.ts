import type { Habit, UserHabit } from '~/types'

/** CRUD + queries for the habit catalog and a user's adopted habits. */
export function useHabits() {
  const supabase = useSupabaseClient()

  /** Public catalog of predefined habits, optionally filtered by category. */
  async function fetchCatalog(category?: string): Promise<Habit[]> {
    let query = supabase
      .from('habits')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error
    return (data ?? []) as unknown as Habit[]
  }

  /** The current user's adopted habits, joined with catalog + streak data. */
  async function fetchUserHabits(): Promise<UserHabit[]> {
    const { data, error } = await supabase
      .from('user_habits')
      .select('*, habit:habits(*), streak:habit_streaks(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    // Supabase returns the joined relations as arrays/objects; normalise streak.
    return (data ?? []).map((row: any) => ({
      ...row,
      streak: Array.isArray(row.streak) ? row.streak[0] : row.streak,
    })) as UserHabit[]
  }

  /** Adopt a habit (atomic insert + social-proof bump via SQL function). */
  async function adoptHabit(habitId: string) {
    const { data, error } = await supabase.rpc('adopt_habit', {
      p_habit_id: habitId,
    })
    if (error) throw error
    return data
  }

  /** Stop tracking a habit without deleting its history. */
  async function archiveHabit(userHabitId: string) {
    const { error } = await supabase
      .from('user_habits')
      .update({ is_active: false })
      .eq('id', userHabitId)
    if (error) throw error
  }

  return { fetchCatalog, fetchUserHabits, adoptHabit, archiveHabit }
}

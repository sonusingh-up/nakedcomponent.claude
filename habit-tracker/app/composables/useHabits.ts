import type { Habit, UserHabit } from '~/types'

/** CRUD + queries for the habit catalog and a user's adopted habits. */
export function useHabits() {
  const supabase = useSupabaseClient<any>()

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

  /** A single adopted habit by its user_habit id, with relations. */
  async function fetchUserHabit(id: string): Promise<UserHabit | null> {
    const { data, error } = await supabase
      .from('user_habits')
      .select('*, habit:habits(*), streak:habit_streaks(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const row = data as any
    return {
      ...row,
      streak: Array.isArray(row.streak) ? row.streak[0] : row.streak,
    } as UserHabit
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

  async function createCustomHabit(payload: {
    name: string
    description: string | null
    category: any
    icon: string
    color: string
  }): Promise<void> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')

    // 1. Insert into public.habits (relies on RLS to set owner_id if we passed it, or we pass it directly)
    const { data: newHabit, error: createError } = await supabase
      .from('habits')
      .insert({
        ...payload,
        owner_id: userId,
        frequency_type: 'daily',
        social_proof_count: 0,
      })
      .select()
      .single()

    if (createError) throw createError

    // 2. Adopt it
    const { error: adoptError } = await supabase.rpc('adopt_habit', {
      p_habit_id: newHabit.id,
    })
    
    if (adoptError) throw adoptError
  }

  return {
    fetchCatalog,
    fetchUserHabits,
    fetchUserHabit,
    adoptHabit,
    archiveHabit,
    createCustomHabit,
  }
}

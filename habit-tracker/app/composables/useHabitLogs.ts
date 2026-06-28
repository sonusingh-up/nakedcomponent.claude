import type { HabitLog } from '~/types'

/** Returns today's date as a local YYYY-MM-DD string (not UTC). */
export function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** Logging daily completions and reading today's progress. */
export function useHabitLogs() {
  const supabase = useSupabaseClient<any>()
  const user = useSupabaseUser()

  /** Mark a habit complete for today (idempotent per day). */
  async function logToday(userHabitId: string, count = 1): Promise<HabitLog> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('habit_logs')
      .upsert(
        {
          user_habit_id: userHabitId,
          user_id: userId,
          log_date: localDate(),
          count,
        },
        { onConflict: 'user_habit_id,log_date' },
      )
      .select()
      .single()
    if (error) throw error
    return data as unknown as HabitLog
  }

  /** Undo today's completion. */
  async function removeTodayLog(userHabitId: string): Promise<void> {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('user_habit_id', userHabitId)
      .eq('log_date', localDate())
    if (error) throw error
  }

  /** All of today's logs for the current user, keyed by user_habit_id. */
  async function fetchTodayLogs(): Promise<Record<string, HabitLog>> {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('log_date', localDate())
    if (error) throw error
    const map: Record<string, HabitLog> = {}
    for (const log of (data ?? []) as unknown as HabitLog[]) {
      map[log.user_habit_id] = log
    }
    return map
  }

  /** Set of YYYY-MM-DD strings the habit was logged on, within the last N days. */
  async function fetchHistory(
    userHabitId: string,
    days = 28,
  ): Promise<Set<string>> {
    const from = new Date()
    from.setDate(from.getDate() - (days - 1))
    const { data, error } = await supabase
      .from('habit_logs')
      .select('log_date')
      .eq('user_habit_id', userHabitId)
      .gte('log_date', localDate(from))
    if (error) throw error
    return new Set((data ?? []).map((r: any) => r.log_date as string))
  }

  return { logToday, removeTodayLog, fetchTodayLogs, fetchHistory }
}

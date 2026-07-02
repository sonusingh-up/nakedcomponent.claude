import type { HabitLog, FreezeBank } from '~/types'

/** Returns today's date as a local YYYY-MM-DD string (not UTC). */
export function localDate(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/**
 * Streak to display *as of today*. The cached habit_streaks row only
 * updates when a log is written, so a streak whose last log is older
 * than yesterday has lapsed even though current_streak still holds
 * the old value.
 */
export function displayStreak(
  streak?: { current_streak: number; last_logged_date: string | null } | null,
): number {
  if (!streak?.current_streak || !streak.last_logged_date) return 0
  const y = new Date()
  y.setDate(y.getDate() - 1)
  return streak.last_logged_date >= localDate(y) ? streak.current_streak : 0
}

/** Logging daily completions and reading today's progress. */
export function useHabitLogs() {
  const supabase = useSupabaseClient<any>()
  const user = useSupabaseUser()

  /** Mark a habit complete for a specific date (idempotent per day). */
  async function logDate(userHabitId: string, date: string, count = 1, status: 'completed' | 'missed' | 'frozen' = 'completed'): Promise<HabitLog> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('habit_logs')
      .upsert(
        {
          user_habit_id: userHabitId,
          user_id: userId,
          log_date: date,
          count,
          status,
        },
        { onConflict: 'user_habit_id,log_date' },
      )
      .select()
      .single()
    if (error) throw error
    return data as unknown as HabitLog
  }

  /** Undo completion for a specific date. */
  async function removeDateLog(userHabitId: string, date: string): Promise<void> {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('user_habit_id', userHabitId)
      .eq('log_date', date)
    if (error) throw error
  }

  /** Mark a habit complete for today (idempotent per day). */
  async function logToday(userHabitId: string, count = 1): Promise<HabitLog> {
    return logDate(userHabitId, localDate(), count)
  }

  /** Undo today's completion. */
  async function removeTodayLog(userHabitId: string): Promise<void> {
    return removeDateLog(userHabitId, localDate())
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
  ): Promise<Record<string, string>> {
    const from = new Date()
    from.setDate(from.getDate() - (days - 1))
    const { data, error } = await supabase
      .from('habit_logs')
      .select('log_date, status')
      .eq('user_habit_id', userHabitId)
      .gte('log_date', localDate(from))
    if (error) throw error
    const map: Record<string, string> = {}
    for (const r of data ?? []) map[r.log_date] = r.status
    return map
  }

  /**
   * Completion history for ALL of the user's habits within the last N days,
   * in a single query. Returns a map of user_habit_id -> Set of YYYY-MM-DD.
   * Powers the dot-matrix heat grid on the dashboard cards.
   */
  async function fetchHistoryAll(
    days = 70,
  ): Promise<Record<string, Record<string, string>>> {
    const from = new Date()
    from.setDate(from.getDate() - (days - 1))
    const { data, error } = await supabase
      .from('habit_logs')
      .select('user_habit_id, log_date, status')
      .gte('log_date', localDate(from))
    if (error) throw error
    const map: Record<string, Record<string, string>> = {}
    for (const r of (data ?? [])) {
      ;(map[r.user_habit_id] ??= {})[r.log_date] = r.status
    }
    return map
  }

  /** The current month's freeze bank (created server-side on demand). */
  async function fetchFreezeBank(): Promise<FreezeBank | null> {
    const { data, error } = await supabase.rpc('get_or_create_freeze_bank')
    if (error) throw error
    return (data ?? null) as FreezeBank | null
  }

  /**
   * Spend a freeze on a date. The RPC checks the balance, spends and
   * writes the frozen log in one transaction, so double-taps or a
   * second device can't double-spend (see migration 0008).
   */
  async function freezeDate(userHabitId: string, date: string): Promise<FreezeBank> {
    const { data, error } = await supabase.rpc('use_freeze', {
      p_user_habit_id: userHabitId,
      p_date: date,
    })
    if (error) throw error
    return data as unknown as FreezeBank
  }

  /** Mark this month's bonus freeze earned. True only when newly awarded. */
  async function awardBonusFreeze(): Promise<boolean> {
    const { data, error } = await supabase.rpc('award_bonus_freeze')
    if (error) throw error
    return data === true
  }

  /**
   * Insert 'missed' markers for yesterday on streaks worth protecting.
   * Reuses the caller's already-fetched history and writes all markers
   * in one batched upsert (previously one query per habit, serially).
   * Returns the user_habit ids that were marked.
   */
  async function detectAtRiskHabits(
    habits: any[],
    history: Record<string, Record<string, string>>,
  ): Promise<string[]> {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const yesterday = localDate(d)

    const candidates = habits.filter(
      (h) => (h.streak?.current_streak ?? 0) > 3 && !history[h.id]?.[yesterday],
    )
    if (!candidates.length) return []

    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) return []

    const rows = candidates.map((h) => ({
      user_habit_id: h.id,
      user_id: userId,
      log_date: yesterday,
      count: 1,
      status: 'missed' as const,
    }))
    const { error } = await supabase
      .from('habit_logs')
      .upsert(rows, { onConflict: 'user_habit_id,log_date', ignoreDuplicates: true })
    if (error) throw error
    return candidates.map((h) => h.id)
  }

  return { logToday, removeTodayLog, logDate, removeDateLog, fetchTodayLogs, fetchHistory, fetchHistoryAll, fetchFreezeBank, freezeDate, awardBonusFreeze, detectAtRiskHabits }
}

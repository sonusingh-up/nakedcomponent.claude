import type { HabitLog, FreezeBank } from '~/types'

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

  async function fetchFreezeBank(): Promise<FreezeBank | null> {
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id
    if (!userId) return null

    const d = new Date()
    const monthStart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    const { data, error } = await supabase
      .from('freeze_banks')
      .select('*')
      .eq('month_start', monthStart)
      .maybeSingle()
    
    if (error) throw error
    if (data) return data as unknown as FreezeBank

    const { data: newData, error: insertError } = await supabase
      .from('freeze_banks')
      .insert({ user_id: userId, month_start: monthStart })
      .select()
      .single()
      
    if (insertError) throw insertError
    return newData as unknown as FreezeBank
  }

  async function freezeDate(userHabitId: string, date: string): Promise<HabitLog> {
    const bank = await fetchFreezeBank()
    if (!bank) throw new Error('No freeze bank available')
    
    const available = 2 - bank.base_used + (bank.bonus_earned && !bank.bonus_used ? 1 : 0)
    if (available <= 0) throw new Error('No freezes available')
    
    let baseUpdate = bank.base_used
    let bonusUpdate = bank.bonus_used
    if (bank.base_used < 2) {
      baseUpdate++
    } else {
      bonusUpdate = true
    }

    await supabase.from('freeze_banks').update({
      base_used: baseUpdate,
      bonus_used: bonusUpdate
    }).eq('id', bank.id)

    return logDate(userHabitId, date, 1, 'frozen')
  }

  async function awardBonusFreeze(): Promise<boolean> {
    const bank = await fetchFreezeBank()
    if (!bank) return false
    if (bank.bonus_earned) return false

    await supabase.from('freeze_banks').update({
      bonus_earned: true
    }).eq('id', bank.id)

    return true
  }

  async function detectAtRiskHabits(habits: any[]) {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    const yesterday = localDate(d)

    const history = await fetchHistoryAll(7)
    
    for (const h of habits) {
      const streak = h.streak?.current_streak ?? 0
      if (streak > 3) {
        const log = history[h.id]?.[yesterday]
        if (!log) {
          await logDate(h.id, yesterday, 1, 'missed')
        }
      }
    }
  }

  return { logToday, removeTodayLog, logDate, removeDateLog, fetchTodayLogs, fetchHistory, fetchHistoryAll, fetchFreezeBank, freezeDate, awardBonusFreeze, detectAtRiskHabits }
}

import type { Reminder, WeekDay } from '~/types'

export const WEEKDAYS: { key: WeekDay; label: string }[] = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
]

/** CRUD for reminders plus browser Notification permission handling. */
export function useReminders() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  async function fetchForHabit(userHabitId: string): Promise<Reminder | null> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_habit_id', userHabitId)
      .maybeSingle()
    if (error) throw error
    return (data ?? null) as Reminder | null
  }

  /** All enabled reminders for the current user (used by the scheduler). */
  async function fetchEnabled(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_enabled', true)
    if (error) throw error
    return (data ?? []) as unknown as Reminder[]
  }

  /** Insert or update the single reminder for a habit. */
  async function saveReminder(payload: {
    id?: string
    user_habit_id: string
    remind_time: string
    remind_days: WeekDay[]
    is_enabled: boolean
  }): Promise<Reminder> {
    if (!user.value) throw new Error('Not authenticated')
    const base = {
      user_id: user.value.id,
      user_habit_id: payload.user_habit_id,
      remind_time: payload.remind_time,
      remind_days: payload.remind_days,
      is_enabled: payload.is_enabled,
    }
    const q = payload.id
      ? supabase.from('reminders').update(base).eq('id', payload.id)
      : supabase.from('reminders').insert(base)
    const { data, error } = await q.select().single()
    if (error) throw error
    return data as unknown as Reminder
  }

  async function deleteReminder(id: string): Promise<void> {
    const { error } = await supabase.from('reminders').delete().eq('id', id)
    if (error) throw error
  }

  /** Ask for notification permission. Returns true if granted. */
  async function requestPermission(): Promise<boolean> {
    if (!import.meta.client || !('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const res = await Notification.requestPermission()
    return res === 'granted'
  }

  function permissionState(): NotificationPermission | 'unsupported' {
    if (!import.meta.client || !('Notification' in window)) return 'unsupported'
    return Notification.permission
  }

  return {
    fetchForHabit,
    fetchEnabled,
    saveReminder,
    deleteReminder,
    requestPermission,
    permissionState,
  }
}

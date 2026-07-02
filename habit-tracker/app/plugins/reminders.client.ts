/**
 * Best-effort client-side reminder scheduler.
 *
 * While the app is open, schedules a browser Notification for each enabled
 * reminder due later today. Robust background delivery (app closed) requires a
 * push backend — see README roadmap.
 */
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  // Bumped by useReminders after save/delete so new reminders schedule
  // without a full reload.
  const version = useState('reminders-version', () => 0)
  const timers: number[] = []

  async function schedule() {
    timers.forEach((t) => clearTimeout(t))
    timers.length = 0

    if (!user.value) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    try {
      const { data } = await supabase
        .from('reminders')
        .select(
          'remind_time, remind_days, user_habit:user_habits(custom_name, habit:habits(name))',
        )
        .eq('is_enabled', true)

      const now = new Date()
      const todayKey = DAY_KEYS[now.getDay()]

      for (const r of (data ?? []) as any[]) {
        if (!r.remind_days?.includes(todayKey)) continue

        const [h, m] = String(r.remind_time).split(':').map(Number)
        const fire = new Date()
        fire.setHours(h ?? 0, m ?? 0, 0, 0)
        const delay = fire.getTime() - now.getTime()
        if (delay <= 0 || delay > 24 * 3600 * 1000) continue

        const uh = Array.isArray(r.user_habit) ? r.user_habit[0] : r.user_habit
        const habitObj = uh?.habit
          ? Array.isArray(uh.habit)
            ? uh.habit[0]
            : uh.habit
          : null
        const name = uh?.custom_name || habitObj?.name || 'your habit'

        const id = window.setTimeout(() => {
          try {
            new Notification('Habit reminder ⏰', { body: `Time to: ${name}` })
          } catch {
            // Notification may be unavailable; ignore.
          }
        }, delay)
        timers.push(id)
      }
    } catch {
      // Supabase not configured / offline — skip silently.
    }
  }

  watch([user, version], () => schedule(), { immediate: true })
})

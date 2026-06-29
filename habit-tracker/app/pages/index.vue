<script setup lang="ts">
import { localDate } from '~/composables/useHabitLogs'

const { fetchUserHabits } = useHabits()
const { logDate, removeDateLog, fetchHistoryAll } = useHabitLogs()
const user = useSupabaseUser()

// Set theme color to orange for the dashboard so the mobile status bar blends seamlessly
useHead({
  meta: [{ name: 'theme-color', content: '#f97316' }]
})

// Selected date for the dashboard view
const selectedDate = ref(localDate())
const isTodaySelected = computed(() => selectedDate.value === localDate())

const selectedDateLabel = computed(() => {
  if (isTodaySelected.value) return 'today'
  const parts = selectedDate.value.split('-').map(Number)
  if (parts.length < 3) return ''
  const [y, m, d] = parts as [number, number, number]
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' })
})

// Client-side fetch
const { data, pending, refresh } = useAsyncData(
  'dashboard',
  async () => {
    const supabase = useSupabaseClient()
    const userId = user.value?.id
    let freezes = 0
    
    if (userId) {
      const { data: profile } = await supabase.from('profiles').select('streak_freezes').eq('id', userId).single()
      freezes = (profile as any)?.streak_freezes ?? 0
    }

    const [habits, history] = await Promise.all([
      fetchUserHabits(),
      fetchHistoryAll(70),
    ])
    return { habits, history, freezes }
  },
  {
    server: false,
    lazy: true,
    default: () => ({
      habits: [],
      history: {} as Record<string, Set<string>>,
      freezes: 0
    }),
  }
)

const habits = computed(() => data.value?.habits ?? [])
const history = computed(() => data.value?.history ?? {})
const streakFreezes = computed(() => data.value?.freezes ?? 0)

const completedCount = computed(() => {
  let count = 0
  for (const h of habits.value) {
    if (history.value[h.id]?.has(selectedDate.value)) count++
  }
  return count
})

const progress = computed(() =>
  habits.value.length
    ? Math.round((completedCount.value / habits.value.length) * 100)
    : 0,
)

const displayName = computed(() => {
  const u = user.value
  const dn = (u?.user_metadata as any)?.display_name as string | undefined
  if (dn) return dn
  const base = (u?.email ?? '').split('@')[0] || 'there'
  return base.charAt(0).toUpperCase() + base.slice(1)
})
const initials = computed(() =>
  displayName.value.replace(/[^a-zA-Z ]/g, '').slice(0, 2).toUpperCase() || 'U',
)

const greeting = ref('Good morning')
onMounted(() => {
  const h = new Date().getHours()
  if (h < 12) greeting.value = 'Good morning'
  else if (h < 18) greeting.value = 'Good afternoon'
  else greeting.value = 'Good evening'
})

const toggling = ref<string | null>(null)
const milestoneEvent = ref<{ title: string; icon: string; streak: number } | null>(null)

async function toggle(userHabitId: string) {
  toggling.value = userHabitId
  const d = selectedDate.value
  
  const oldHabit = habits.value.find(h => h.id === userHabitId)
  const oldStreak = oldHabit?.streak?.current_streak ?? 0

  try {
    if (history.value[userHabitId]?.has(d)) {
      history.value[userHabitId].delete(d)
      await removeDateLog(userHabitId, d)
    } else {
      if (!history.value[userHabitId]) history.value[userHabitId] = new Set()
      history.value[userHabitId].add(d)
      await logDate(userHabitId, d)
      if (import.meta.client && navigator.vibrate) navigator.vibrate(15)
    }
    
    // Refresh to ensure streaks are up to date
    await refresh()

    const newHabit = habits.value.find(h => h.id === userHabitId)
    const newStreak = newHabit?.streak?.current_streak ?? 0
    
    if (newStreak > oldStreak && [7, 21, 100].includes(newStreak)) {
      milestoneEvent.value = {
        title: newHabit?.habit?.name || 'Habit',
        icon: newHabit?.habit?.icon || 'i-lucide-activity',
        streak: newStreak
      }
      if (import.meta.client && navigator.vibrate) navigator.vibrate([30, 50, 30])
    }
  } catch (e) {
    await refresh()
  } finally {
    toggling.value = null
  }
}

// --- NEW ADVANCED DASHBOARD STATS --- //

// Generate the last 7 days for the top strip and bottom chart
const last7Days = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const ds = localDate(d)
    const label = d.toLocaleDateString('en-US', { weekday: 'narrow' })
    
    // Calculate how many habits were done on this day across ALL active habits
    let doneCount = 0
    let totalActive = habits.value.length
    habits.value.forEach(h => {
      if (history.value[h.id]?.has(ds)) doneCount++
    })
    
    const percentage = totalActive > 0 ? (doneCount / totalActive) * 100 : 0
    
    days.push({ 
      date: ds, 
      label, 
      isToday: i === 0,
      isSelected: ds === selectedDate.value,
      doneCount,
      percentage,
      isActiveDay: doneCount > 0 // did they do anything at all?
    })
  }
  return days
})

const activeDaysThisWeek = computed(() => last7Days.value.filter(d => d.isActiveDay).length)
const avgCompletionThisWeek = computed(() => {
  if (last7Days.value.length === 0) return 0
  const sum = last7Days.value.reduce((acc, curr) => acc + curr.percentage, 0)
  return Math.round(sum / 7)
})

// Find highest active streak across all habits
const maxStreak = computed(() => {
  if (!habits.value.length) return 0
  return Math.max(...habits.value.map(h => h.streak?.current_streak ?? 0))
})

const isExpanded = ref(false)
const visibleHabits = computed(() => {
  if (isExpanded.value) return habits.value
  return habits.value.slice(0, 3)
})

const dynamicInsight = computed(() => {
  const activeCount = last7Days.value.filter(d => d.isActiveDay).length
  const highDays = last7Days.value.filter(d => d.percentage >= 80).length
  const totalCompleted = last7Days.value.reduce((acc, d) => acc + d.doneCount, 0)
  
  if (activeCount === 0) {
    return 'You haven\'t tracked any habits this week. <span class="font-medium text-[#f97316]">Start small today!</span>'
  }
  if (highDays === 7) {
    return 'Incredible! You hit <span class="font-medium text-[#f97316]">over 80%</span> every day this week. Flawless execution.'
  }
  if (highDays > 0) {
    return `You crushed it on <span class="font-medium text-[#f97316]">${highDays} day${highDays > 1 ? 's' : ''}</span> this week. Keep building that momentum!`
  }
  return `You completed <span class="font-medium text-[#f97316]">${totalCompleted} habit${totalCompleted > 1 ? 's' : ''}</span> this week. Consistency is key!`
})

</script>

<template>
  <div class="mx-auto max-w-md pb-24">
    <!-- ORANGE HERO SECTION (EDGE-TO-EDGE HEADER WITH NOTCH SUPPORT) -->
    <section 
      class="-mx-4 mb-6 overflow-hidden rounded-b-[32px] bg-[#f97316] px-5 pb-6 text-white shadow-[0_8px_30px_rgba(249,115,22,0.15)]"
      style="margin-top: calc(-1 * (env(safe-area-inset-top) + 1.25rem)); padding-top: calc(env(safe-area-inset-top) + 1.75rem);"
    >
      
      <!-- Top Nav -->
      <div class="mb-4 flex items-center justify-between">
        <NuxtLink to="/settings" class="flex size-9 items-center justify-center rounded-[10px] bg-black/[0.18] text-[12px] font-bold transition-transform hover:scale-105">
          {{ initials }}
        </NuxtLink>
        <div class="flex gap-2">
          <div 
            class="flex items-center gap-1 rounded-[10px] bg-black/[0.12] px-2.5 py-1 transition-transform hover:scale-105 hover:bg-black/20"
            title="Streak Freezes Available"
          >
            <UIcon name="i-lucide-snowflake" class="size-4 text-sky-400" />
            <span class="text-[12px] font-semibold text-sky-50">{{ streakFreezes }}</span>
          </div>
          <NuxtLink to="/discover" class="flex size-8 items-center justify-center rounded-[10px] bg-black/[0.12] transition-transform hover:scale-105 hover:bg-black/20">
            <UIcon name="i-lucide-plus" class="size-4 text-white" />
          </NuxtLink>
          <NuxtLink to="/settings" class="flex size-8 items-center justify-center rounded-[10px] bg-black/[0.12] transition-transform hover:scale-105 hover:bg-black/20">
            <UIcon name="i-lucide-menu" class="size-4 text-white" />
          </NuxtLink>
        </div>
      </div>

      <!-- Greeting -->
      <div class="mb-1 text-[11px] font-bold tracking-[0.08em] text-white/80 uppercase">
        {{ greeting }} {{ displayName }}
      </div>
      <h1 class="mb-4 text-[15px] font-medium leading-[1.35]">
        Keep the streak alive,<br />spark your daily motivation.
      </h1>

      <!-- 7-Day Week Strip -->
      <div class="mb-3 rounded-[12px] bg-black/[0.15] px-2 pb-1.5 pt-2.5">
        <div class="flex justify-around">
          <button 
            v-for="day in last7Days" :key="day.date" 
            class="text-center outline-none transition-transform hover:scale-105"
            @click="selectedDate = day.date"
          >
            <div 
              class="mx-auto mb-1 size-[24px] rounded-full transition-all"
              :class="[
                day.isSelected && !day.isActiveDay ? 'flex items-center justify-center border-[1.5px] border-white' : '',
                day.isActiveDay && !day.isSelected ? 'bg-white/30' : 'bg-white/[0.07]',
                day.isActiveDay && day.isSelected ? 'flex items-center justify-center border-[1.5px] border-white' : ''
              ]"
            >
              <div v-if="day.isSelected" class="size-[8px] rounded-full bg-white"></div>
              <UIcon v-else-if="day.isActiveDay && !day.isSelected" name="i-lucide-check" class="m-auto size-3.5 mt-1 text-white/90" />
            </div>
            <div class="text-[11px]" :class="day.isSelected ? 'font-medium text-white' : 'text-white/70'">
              {{ day.label }}
            </div>
          </button>
        </div>
        <div class="mt-1 flex justify-end">
          <span class="rounded-[4px] bg-black/[0.28] px-1.5 py-[2px] text-[10px] font-bold tracking-wide text-white/90">NEW</span>
        </div>
      </div>

      <!-- Progress -->
      <div v-if="habits.length" class="mb-2 flex items-baseline justify-between">
        <span class="text-[18px] font-semibold text-white">
          {{ completedCount }} <span class="text-[12px] font-medium text-white/70">/{{ habits.length }} {{ selectedDateLabel }}</span>
        </span>
        <span class="text-[13px] font-semibold text-white">{{ progress }}%</span>
      </div>
      <div v-if="habits.length" class="mb-4 h-[4px] rounded-full bg-white/20">
        <div class="h-[4px] rounded-full bg-white transition-all duration-700" :style="{ width: progress + '%' }"/>
      </div>

      <!-- Micro Stats -->
      <div class="flex items-center gap-2">
        <div class="flex-1 rounded-[10px] bg-black/[0.15] py-2 text-center">
          <div class="flex items-center justify-center gap-0.5 text-[14px] font-semibold text-white">
            <UIcon name="i-lucide-flame" class="size-3.5 text-white" />{{ maxStreak }}d
          </div>
          <div class="mt-[2px] text-[10px] font-medium uppercase tracking-[0.05em] text-white/70">streak</div>
        </div>
        <div class="flex-1 rounded-[10px] bg-black/[0.15] py-2 text-center">
          <div class="text-[14px] font-semibold text-white">{{ avgCompletionThisWeek }}%</div>
          <div class="mt-[2px] text-[10px] font-medium uppercase tracking-[0.05em] text-white/70">this week</div>
        </div>
        <div class="flex-1 rounded-[10px] bg-black/[0.15] py-2 text-center relative">
          <div class="absolute -right-1 -top-2 rounded-[4px] bg-black/[0.28] px-1.5 py-[2px] text-[9px] font-bold tracking-wide text-white/90">NEW</div>
          <div class="text-[14px] font-semibold text-white">{{ activeDaysThisWeek }}/7</div>
          <div class="mt-[2px] text-[10px] font-medium uppercase tracking-[0.05em] text-white/70">days active</div>
        </div>
      </div>
    </section>

    <!-- DARK HABIT AREA -->
    <section class="min-h-[300px]">
      
      <div v-if="pending" class="space-y-4">
        <USkeleton v-for="i in 3" :key="i" class="h-[72px] rounded-[16px] bg-white/[0.05]" />
      </div>

      <template v-else-if="habits.length">
        
        <!-- Section Header -->
        <div class="mb-3 flex items-center justify-between pl-1">
          <span class="text-[12px] font-bold tracking-[0.08em] text-stone-500 dark:text-[#666]">
            YOUR HABITS
          </span>
        </div>

        <!-- Habits -->
        <div class="flex flex-col gap-2.5 mb-3">
          <HabitCard
            v-for="habit in visibleHabits"
            :key="habit.id"
            :habit="habit"
            :completed="history[habit.id]?.has(selectedDate) ?? false"
            :history="history[habit.id]"
            @toggle="toggle(habit.id)"
            @open="navigateTo(`/track/${habit.id}`)"
          />
        </div>

        <!-- Expand Toggle -->
        <button 
          v-if="habits.length > 3"
          class="mb-4 w-full rounded-[16px] bg-white border border-stone-200 py-3 text-center text-[12px] font-medium text-stone-500 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-700 dark:border-[#282828] dark:bg-[#111] dark:text-[#888] dark:shadow-none dark:hover:bg-[#151515] dark:hover:text-[#aaa]"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? 'Show less' : `Show ${habits.length - 3} more` }}
        </button>

        <!-- Insight Card -->
        <div class="mb-4 rounded-[16px] border border-[#f97316]/20 bg-orange-50/60 p-3.5 dark:border-[#f97316]/22 dark:bg-[#15100a]">
          <div class="mb-2 flex items-center gap-1.5">
            <UIcon name="i-lucide-lightbulb" class="size-4 text-[#f97316]" />
            <span class="text-[11px] font-bold tracking-[0.08em] text-[#f97316]">INSIGHT</span>
          </div>
          <div class="text-[13px] leading-[1.6] text-stone-600 dark:text-[#bbb]" v-html="dynamicInsight"></div>
        </div>

        <!-- Weekly Trend Chart -->
        <div class="rounded-[16px] border border-stone-200 bg-white p-4 shadow-sm dark:border-[#282828] dark:bg-[#111] dark:shadow-none">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-[11px] font-bold tracking-[0.08em] text-stone-500 dark:text-[#666]">WEEKLY TREND</span>
          </div>
          
          <div class="mb-2 flex h-10 items-end gap-1.5">
            <button 
              v-for="day in last7Days" 
              :key="'bar-'+day.date" 
              class="flex-1 rounded-[3px] bg-[#f97316] transition-all duration-300 outline-none hover:opacity-100"
              :class="day.isSelected ? 'ring-1 ring-[#111] ring-offset-[1.5px] ring-offset-white dark:ring-white dark:ring-offset-[#111]' : ''"
              :style="{ 
                height: Math.max(day.percentage, 15) + '%',
                opacity: day.isSelected ? 1 : (day.percentage === 0 ? 0.15 : (day.percentage / 100) * 0.7 + 0.3)
              }"
              @click="selectedDate = day.date"
              :aria-label="day.label"
            />
          </div>
          
          <div class="flex justify-between">
            <span 
              v-for="day in last7Days" 
              :key="'lbl-'+day.date" 
              class="text-[11px]"
              :class="day.isSelected ? 'font-bold text-[#f97316]' : 'font-medium text-stone-400 dark:text-[#555]'"
            >
              {{ day.label }}
            </span>
          </div>
        </div>
        
      </template>

      <div v-else class="mt-8">
        <AppEmptyState
          icon="i-lucide-sprout"
          title="Start your first habit"
          description="Browse habits that fit your lifestyle and start building streaks today."
          cta-label="Discover habits"
          cta-to="/discover"
        />
      </div>
    </section>
  </div>

  <!-- Milestone Celebration Modal -->
  <UModal :model-value="!!milestoneEvent" @update:model-value="milestoneEvent = null" :ui="({ content: 'sm:max-w-sm rounded-[24px]' } as any)">
    <div v-if="milestoneEvent" class="relative overflow-hidden bg-white p-8 text-center shadow-2xl dark:bg-[#1c1c1c] rounded-[24px]">
      
      <!-- Glowing background effect -->
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-[#f97316]/20 to-transparent" />
      
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-[16px] bg-[#f97316]/20 shadow-[0_0_40px_rgba(249,115,22,0.4)]">
        <UIcon :name="milestoneEvent.icon" class="size-8 text-[#f97316]" />
      </div>
      
      <h2 class="mb-1 text-[22px] font-bold tracking-tight text-stone-900 dark:text-white">Milestone Unlocked!</h2>
      <p class="mb-6 text-[14px] leading-relaxed text-stone-600 dark:text-[#bbb]">
        Incredible work! You've hit a <span class="font-bold text-[#f97316]">{{ milestoneEvent.streak }}-day</span> streak for <strong>{{ milestoneEvent.title }}</strong>.
      </p>
      
      <button 
        @click="milestoneEvent = null"
        class="w-full rounded-[12px] bg-[#f97316] py-3 text-[14px] font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Keep it up
      </button>
    </div>
  </UModal>
</template>

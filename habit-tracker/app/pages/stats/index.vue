<script setup lang="ts">
import { localDate, displayStreak } from '~/composables/useHabitLogs'

const { fetchUserHabits } = useHabits()
const { fetchHistoryAll } = useHabitLogs()

useHead({ title: 'Stats — Habits' })

const { data, pending, refresh } = useAsyncData(
  'stats',
  async () => {
    const [habits, history] = await Promise.all([
      fetchUserHabits(),
      fetchHistoryAll(365), // Fetch a full year for the heatmap
    ])
    return { habits, history }
  },
  {
    server: false,
    lazy: true,
    default: () => ({
      habits: [],
      history: {} as Record<string, Record<string, string>>,
    }),
  }
)

const habits = computed(() => data.value?.habits ?? [])
const history = computed(() => data.value?.history ?? {})

// Global Stats
const totalCompletions = computed(() => {
  let total = 0
  for (const dates of Object.values(history.value)) {
    total += Object.values(dates).filter(s => s === 'completed').length
  }
  return total
})

const bestGlobalStreak = computed(() => {
  if (!habits.value.length) return 0
  return Math.max(...habits.value.map(h => h.streak?.longest_streak ?? 0))
})

const activeDaysCount = computed(() => {
  const uniqueDays = new Set<string>()
  for (const dates of Object.values(history.value)) {
    for (const [d, s] of Object.entries(dates)) {
      if (s === 'completed' || s === 'frozen') {
        uniqueDays.add(d)
      }
    }
  }
  return uniqueDays.size
})

// Heatmap Generation (Aligning to days of the week)
const heatmapDays = computed(() => {
  const days = []
  const today = new Date()
  
  // today.getDay() returns 0 for Sunday, 6 for Saturday.
  // We want to show the current week, plus 51 full weeks before it.
  const currentWeekDays = today.getDay() + 1
  const totalDays = (51 * 7) + currentWeekDays
  
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const ds = localDate(d)
    
    // Count how many habits completed on this day
    let completions = 0
    for (const h of habits.value) {
      if (history.value[h.id]?.[ds] === 'completed') {
        completions++
      }
    }
    
    days.push({
      date: ds,
      completions,
      intensity: completions === 0 ? 0 : completions <= 2 ? 1 : completions <= 4 ? 2 : 3
    })
  }
  
  return days
})

// Scroll the heatmap to the right (latest date) on mount
const heatmapContainer = ref<HTMLElement | null>(null)
onMounted(() => {
  setTimeout(() => {
    if (heatmapContainer.value) {
      heatmapContainer.value.scrollLeft = heatmapContainer.value.scrollWidth
    }
  }, 100)

  // Stale-while-revalidate: cached stats paint instantly on revisit,
  // then refresh in the background so post-toggle numbers appear.
  if (!pending.value) refresh()
})

</script>

<template>
  <div class="mx-auto max-w-md pb-24">
    
    <!-- Header -->
    <header class="mb-6 mt-4">
      <h1 class="text-3xl font-semibold tracking-[-0.02em] text-stone-900 dark:text-white">Stats</h1>
      <p class="mt-1 text-[13px] font-medium text-stone-500 dark:text-[#bbb]">Your all-time progress and history</p>
    </header>

    <div v-if="pending && !habits.length" class="space-y-4">
      <USkeleton class="h-32 w-full rounded-[24px] bg-white/[0.05]" />
      <USkeleton class="h-48 w-full rounded-[24px] bg-white/[0.05]" />
    </div>

    <AppEmptyState
      v-else-if="!habits.length"
      icon="i-lucide-bar-chart-2"
      title="No stats yet"
      description="Adopt a habit and start logging — your progress and heatmap will show up here."
      cta-label="Discover habits"
      cta-to="/discover"
    />

    <template v-else>
      
      <!-- Global Summary Cards -->
      <div class="mb-6 grid grid-cols-2 gap-3">
        <div class="rounded-[20px] border border-stone-200 bg-white p-5 text-center shadow-sm dark:border-[#282828] dark:bg-[#111] dark:shadow-none">
          <div class="text-[32px] font-bold tracking-tight text-stone-900 dark:text-white">{{ totalCompletions }}</div>
          <div class="mt-1 text-[10px] font-bold tracking-[0.08em] text-stone-500 uppercase dark:text-[#777]">Total Logs</div>
        </div>
        <div class="relative overflow-hidden rounded-[20px] border border-[#f97316]/30 bg-orange-50/50 p-5 text-center shadow-[0_0_15px_rgba(249,115,22,0.1)] dark:bg-[#111]">
          <div class="absolute inset-0 bg-gradient-to-b from-[#f97316]/10 to-transparent pointer-events-none" />
          <div class="flex items-center justify-center gap-1.5 text-[32px] font-bold tracking-tight text-[#f97316]">
            <UIcon name="i-lucide-flame" class="size-6 drop-shadow-md" />{{ bestGlobalStreak }}
          </div>
          <div class="mt-1 text-[10px] font-bold tracking-[0.08em] text-[#f97316]/80 uppercase">Best Streak</div>
        </div>
      </div>

      <!-- Activity Heatmap -->
      <section class="mb-8 overflow-hidden rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm dark:border-[#282828] dark:bg-[#111] dark:shadow-none">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-[12px] font-bold tracking-[0.08em] text-stone-800 uppercase dark:text-white">Activity Heatmap</h2>
          <span class="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-500 dark:bg-[#1c1c1c] dark:text-[#888]">{{ activeDaysCount }} Days Active</span>
        </div>
        
        <!-- Horizontally Scrollable Area -->
        <ClientOnly>
          <div 
            ref="heatmapContainer"
            class="grid grid-rows-7 overflow-x-auto pb-4 scrollbar-hide"
            style="grid-auto-flow: column; gap: 2.5px;"
          >
            <div 
              v-for="day in heatmapDays" 
              :key="day.date"
              class="size-3 rounded-[2px] transition-colors hover:ring-1 hover:ring-white/50"
              :class="[
                day.intensity === 0 ? 'bg-stone-100 dark:bg-[#1c1c1c]' : '',
                day.intensity === 1 ? 'bg-[#f97316]/30' : '',
                day.intensity === 2 ? 'bg-[#f97316]/70' : '',
                day.intensity === 3 ? 'bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.4)]' : '',
              ]"
              :title="`${day.date}: ${day.completions} habits`"
            />
          </div>
        </ClientOnly>
        <div class="mt-3 flex items-center justify-end gap-2 text-[10px] font-medium text-stone-400 dark:text-[#666]">
          <span>Less</span>
          <div class="flex gap-[3px]">
            <div class="size-2.5 rounded-[2px] bg-stone-100 dark:bg-[#1a1a1a]" />
            <div class="size-2.5 rounded-[2px] bg-[#f97316]/30" />
            <div class="size-2.5 rounded-[2px] bg-[#f97316]/70" />
            <div class="size-2.5 rounded-[2px] bg-[#f97316]" />
          </div>
          <span>More</span>
        </div>
      </section>

      <!-- Per-Habit Breakdown -->
      <section>
        <h2 class="mb-4 ml-1 text-[12px] font-bold tracking-[0.08em] text-stone-500 uppercase dark:text-[#666]">Per-Habit Breakdown</h2>
        <div class="flex flex-col gap-2.5">
          <NuxtLink
            v-for="habit in habits" 
            :key="habit.id"
            :to="`/track/${habit.id}`"
            class="group flex items-center gap-4 rounded-[20px] bg-white border border-stone-200 p-4 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50 dark:border-[#282828] dark:bg-[#111] dark:shadow-none dark:hover:border-[#444] dark:hover:bg-[#151515]"
          >
            <!-- Icon -->
            <div class="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-stone-100 transition-colors group-hover:bg-stone-200 dark:bg-[#1c1c1c] dark:group-hover:bg-[#252525]">
              <UIcon :name="habit.habit?.icon || 'i-lucide-activity'" class="size-5 text-[#f97316]" />
            </div>
            
            <!-- Details -->
            <div class="min-w-0 flex-1">
              <div class="truncate text-[15px] font-semibold text-stone-800 dark:text-white">{{ habit.custom_name || habit.habit?.name || 'Habit' }}</div>
              <div class="mt-1.5 flex items-center gap-2 text-[11px] font-medium text-stone-500 dark:text-[#888]">
                <span class="flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 dark:bg-[#1c1c1c]"><UIcon name="i-lucide-check-circle-2" class="size-3 text-stone-400 dark:text-[#aaa]" /> {{ Object.values(history[habit.id] || {}).filter(s => s === 'completed').length }} total</span>
                <span class="flex items-center gap-1 rounded-md bg-[#f97316]/10 px-2 py-0.5 text-[#f97316]"><UIcon name="i-lucide-flame" class="size-3" /> {{ displayStreak(habit.streak) }} streak</span>
              </div>
            </div>
            
            <UIcon name="i-lucide-chevron-right" class="size-5 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-stone-500 dark:text-[#444] dark:group-hover:text-[#888]" />
          </NuxtLink>
        </div>
      </section>
      
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

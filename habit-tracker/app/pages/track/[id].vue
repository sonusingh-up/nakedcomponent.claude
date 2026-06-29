<script setup lang="ts">
import { CATEGORY_META, type HabitCategory } from '~/types'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { fetchUserHabit, archiveHabit } = useHabits()
const { fetchHistory, logToday, removeTodayLog } = useHabitLogs()
import { localDate } from '~/composables/useHabitLogs'

const toast = useToast()

const { data, pending, refresh } = useAsyncData(
  () => `track-${id.value}`,
  async () => {
    const [habit, history] = await Promise.all([
      fetchUserHabit(id.value),
      fetchHistory(id.value, 28),
    ])
    return { habit, history }
  },
  { server: false, default: () => ({ habit: null, history: {} as Record<string, string> }) },
)

const habit = computed(() => data.value?.habit ?? null)
const history = computed(() => data.value?.history ?? {})

const name = computed(
  () => habit.value?.custom_name ?? habit.value?.habit?.name ?? 'Habit',
)
const color = computed(() => habit.value?.habit?.color ?? '#c96442')
const category = computed(() =>
  habit.value ? CATEGORY_META[habit.value.habit?.category as HabitCategory] : null,
)

const todayStr = localDate()
const completedToday = computed(() => history.value[todayStr] === 'completed')
const currentStreak = computed(() => habit.value?.streak?.current_streak ?? 0)
const longestStreak = computed(() => habit.value?.streak?.longest_streak ?? 0)
const totalDays = computed(() => Object.values(history.value).filter(s => s === 'completed').length)

const frozenDays = computed(() => {
  return Object.entries(history.value)
    .filter(([_, status]) => status === 'frozen')
    .map(([date]) => date)
    .sort()
    .reverse()
})

// Last 28 days, oldest → newest, for the heat grid.
const grid = computed(() => {
  const days: { date: string; done: boolean; frozen: boolean; label: number }[] = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = localDate(d)
    const st = history.value[ds]
    days.push({ date: ds, done: st === 'completed', frozen: st === 'frozen', label: d.getDate() })
  }
  return days
})

const busy = ref(false)
async function toggleToday() {
  busy.value = true
  try {
    if (completedToday.value) {
      await removeTodayLog(id.value)
    } else {
      await logToday(id.value)
      if (import.meta.client && navigator.vibrate) navigator.vibrate(15)
    }
    await refresh()
  } finally {
    busy.value = false
  }
}

async function stopTracking() {
  if (!confirm(`Stop tracking "${name.value}"? Your history is kept.`)) return
  await archiveHabit(id.value)
  toast.add({ title: 'Habit archived', icon: 'i-lucide-archive' })
  await navigateTo('/')
}
</script>

<template>
  <div class="px-2">
    <button
      class="mb-6 mt-2 flex items-center gap-1.5 text-[13px] font-medium text-stone-500 transition-colors hover:text-stone-300"
      @click="navigateTo('/')"
    >
      <UIcon name="i-lucide-chevron-left" class="size-4" /> Back
    </button>

    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-24 rounded-[24px] bg-white/[0.02]" />
      <USkeleton class="h-32 rounded-[24px] bg-white/[0.02]" />
    </div>

    <AppEmptyState
      v-else-if="!habit"
      icon="i-lucide-search-x"
      title="Habit not found"
      description="This habit may have been removed."
      cta-label="Back home"
      cta-to="/"
    />

    <template v-else>
      <!-- Header -->
      <header class="mb-8 flex items-center gap-5">
        <div
          class="flex size-16 items-center justify-center rounded-[20px] ring-1 ring-white/[0.08]"
          :style="{ backgroundColor: color + '14', color }"
        >
          <UIcon :name="habit.habit?.icon ?? 'i-lucide-circle-dot'" class="size-8 drop-shadow-md" />
        </div>
        <div>
          <h1 class="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-stone-50">{{ name }}</h1>
          <p class="mt-0.5 flex items-center gap-1.5 text-[13px] text-stone-400">
            <UIcon :name="category?.icon" class="size-3.5" />
            {{ category?.label }}
          </p>
        </div>
      </header>

      <!-- Stats -->
      <div class="mb-6 grid grid-cols-3 gap-3">
        <div class="relative overflow-hidden rounded-[20px] bg-white/[0.02] p-5 text-center ring-1 ring-white/[0.05]">
          <!-- Glow if streak is active -->
          <div v-if="currentStreak > 0" class="absolute -bottom-4 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-ember-500/20 blur-xl"></div>
          <p class="relative z-10 tabular text-[32px] font-semibold tracking-tight text-ember-400">
            {{ currentStreak }}
          </p>
          <p class="relative z-10 mt-1 text-[11px] font-medium tracking-wide uppercase text-stone-500">Current 🔥</p>
        </div>
        <div class="rounded-[20px] bg-white/[0.02] p-5 text-center ring-1 ring-white/[0.05]">
          <p class="tabular text-[32px] font-semibold tracking-tight text-stone-100">{{ longestStreak }}</p>
          <p class="mt-1 text-[11px] font-medium tracking-wide uppercase text-stone-500">Longest</p>
        </div>
        <div class="rounded-[20px] bg-white/[0.02] p-5 text-center ring-1 ring-white/[0.05]">
          <p class="tabular text-[32px] font-semibold tracking-tight text-stone-100">{{ totalDays }}</p>
          <p class="mt-1 text-[11px] font-medium tracking-wide uppercase text-stone-500">Total days</p>
        </div>
      </div>

      <!-- 28-day grid -->
      <ClientOnly>
        <section class="mb-8 rounded-[24px] bg-white/[0.02] p-6 ring-1 ring-white/[0.05]">
          <h2 class="mb-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
            Last 4 Weeks
          </h2>
          <div class="grid grid-cols-7 gap-2.5">
            <div
              v-for="day in grid"
              :key="day.date"
              class="flex aspect-square items-center justify-center rounded-[8px] text-[11px] font-semibold transition-all duration-300"
              :class="[
                day.done ? 'bg-ember-500/20 text-ember-400 ring-1 ring-ember-500/30' : '',
                day.frozen ? 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30' : '',
                !day.done && !day.frozen ? 'bg-white/[0.03] text-stone-600' : ''
              ]"
              :title="day.date"
            >
              {{ day.label }}
            </div>
          </div>
        </section>
        <template #fallback>
          <USkeleton class="mb-8 h-48 rounded-[24px] bg-white/[0.02]" />
        </template>
      </ClientOnly>

      <!-- Freeze History -->
      <section v-if="frozenDays.length > 0" class="mb-8">
        <h2 class="mb-3 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-500">
          Freeze History
        </h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="date in frozenDays"
            :key="date"
            class="flex items-center gap-3 rounded-[14px] bg-white/[0.02] p-3 ring-1 ring-white/[0.05]"
          >
            <div class="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-sky-500/10">
              <UIcon name="i-lucide-snowflake" class="size-[18px] text-sky-400" />
            </div>
            <div>
              <div class="mb-0.5 text-[13px] font-medium text-white">Freeze used</div>
              <div class="text-[11px] text-stone-400">
                Protected your streak on {{ new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Button -->
      <button
        class="group relative flex w-full items-center justify-center gap-2 rounded-[20px] py-4 text-[15px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] disabled:opacity-50"
        :class="
          completedToday
            ? 'bg-white/[0.04] text-stone-300 ring-1 ring-inset ring-white/[0.1] hover:bg-white/[0.06]'
            : 'spark-gradient text-white shadow-[0_2px_16px_rgba(255,106,24,0.25)] hover:shadow-[0_4px_24px_rgba(255,106,24,0.4)]'
        "
        :disabled="busy"
        @click="toggleToday"
      >
        <!-- Inner hover highlight for active button -->
        <div v-if="!completedToday" class="absolute inset-0 rounded-[20px] bg-white/0 transition-colors group-hover:bg-white/10" />
        
        <UIcon 
          :name="busy ? 'i-lucide-loader-2' : completedToday ? 'i-lucide-rotate-ccw' : 'i-lucide-check'" 
          class="relative z-10 size-[18px]" 
          :class="{ 'animate-spin': busy }"
        />
        <span class="relative z-10">{{ completedToday ? 'Completed today — undo' : 'Mark complete for today' }}</span>
      </button>

      <ReminderForm class="mt-6 block" :user-habit-id="id" />

      <button
        class="mx-auto mt-8 flex items-center gap-1.5 text-[13px] font-medium text-stone-500 transition-colors hover:text-rose-400"
        @click="stopTracking"
      >
        <UIcon name="i-lucide-archive" class="size-[14px]" /> Stop tracking
      </button>
    </template>
  </div>
</template>

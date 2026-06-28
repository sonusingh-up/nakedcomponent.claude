<script setup lang="ts">
import { CATEGORY_META, type HabitCategory } from '~/types'

const route = useRoute()
const id = computed(() => route.params.id as string)

const { fetchUserHabit, archiveHabit } = useHabits()
const { fetchHistory, logToday, removeTodayLog } = useHabitLogs()
// localDate() is auto-imported from composables/useHabitLogs.ts
const toast = useToast()

const { data, pending, refresh } = await useAsyncData(
  () => `track-${id.value}`,
  async () => {
    const [habit, history] = await Promise.all([
      fetchUserHabit(id.value),
      fetchHistory(id.value, 28),
    ])
    return { habit, history }
  },
  { server: false, default: () => ({ habit: null, history: new Set<string>() }) },
)

const habit = computed(() => data.value?.habit ?? null)
const history = computed(() => data.value?.history ?? new Set<string>())

const name = computed(
  () => habit.value?.custom_name ?? habit.value?.habit?.name ?? 'Habit',
)
const color = computed(() => habit.value?.habit?.color ?? '#c96442')
const category = computed(() =>
  habit.value ? CATEGORY_META[habit.value.habit?.category as HabitCategory] : null,
)

const todayStr = localDate()
const completedToday = computed(() => history.value.has(todayStr))
const currentStreak = computed(() => habit.value?.streak?.current_streak ?? 0)
const longestStreak = computed(() => habit.value?.streak?.longest_streak ?? 0)
const totalDays = computed(() => history.value.size)

// Last 28 days, oldest → newest, for the heat grid.
const grid = computed(() => {
  const days: { date: string; done: boolean; label: number }[] = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = localDate(d)
    days.push({ date: ds, done: history.value.has(ds), label: d.getDate() })
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
  <div>
    <button
      class="mb-3 mt-1 flex items-center gap-1 text-sm font-medium text-stone-500"
      @click="navigateTo('/')"
    >
      <UIcon name="i-lucide-chevron-left" class="size-5" /> Back
    </button>

    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-24 rounded-3xl" />
      <USkeleton class="h-32 rounded-3xl" />
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
      <header class="mb-5 flex items-center gap-4">
        <div
          class="flex size-14 items-center justify-center rounded-2xl"
          :style="{ backgroundColor: color + '1f', color }"
        >
          <UIcon :name="habit.habit?.icon ?? 'i-lucide-circle-dot'" class="size-7" />
        </div>
        <div>
          <h1 class="display-serif text-3xl text-stone-900">{{ name }}</h1>
          <p class="text-sm text-stone-500">{{ category?.label }}</p>
        </div>
      </header>

      <!-- Stats -->
      <div class="mb-5 grid grid-cols-3 gap-3">
        <div class="rounded-2xl border border-[var(--color-cream-200)] bg-white p-4 text-center">
          <p class="tabular text-3xl font-semibold text-terracotta-600">
            {{ currentStreak }}
          </p>
          <p class="mt-1 text-xs text-stone-500">Current 🔥</p>
        </div>
        <div class="rounded-2xl border border-[var(--color-cream-200)] bg-white p-4 text-center">
          <p class="tabular text-3xl font-semibold text-stone-800">{{ longestStreak }}</p>
          <p class="mt-1 text-xs text-stone-500">Longest</p>
        </div>
        <div class="rounded-2xl border border-[var(--color-cream-200)] bg-white p-4 text-center">
          <p class="tabular text-3xl font-semibold text-stone-800">{{ totalDays }}</p>
          <p class="mt-1 text-xs text-stone-500">Total days</p>
        </div>
      </div>

      <!-- 28-day grid -->
      <ClientOnly>
        <section class="mb-6 rounded-[3rem] border border-[var(--color-cream-200)] bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-sm font-semibold tracking-wide text-stone-500">
            LAST 4 WEEKS
          </h2>
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in grid"
              :key="day.date"
              class="flex aspect-square items-center justify-center rounded-full text-[11px] font-medium transition-colors"
              :style="
                day.done
                  ? { backgroundColor: '#5c8b51', color: '#fff' }
                  : { backgroundColor: 'var(--color-cream-100)', color: '#9a948e' }
              "
              :title="day.date"
            >
              {{ day.label }}
            </div>
          </div>
        </section>
        <template #fallback>
          <USkeleton class="mb-6 h-48 rounded-[3rem]" />
        </template>
      </ClientOnly>

      <UButton
        class="rounded-full px-6 py-3.5 text-lg font-medium shadow-sm"
        :class="completedToday ? 'bg-white text-stone-800 hover:bg-stone-50' : ''"
        block
        size="xl"
        :color="completedToday ? 'neutral' : 'primary'"
        :variant="completedToday ? 'solid' : 'solid'"
        :loading="busy"
        :icon="completedToday ? 'i-lucide-rotate-ccw' : 'i-lucide-check'"
        @click="toggleToday"
      >
        {{ completedToday ? 'Completed today — undo' : 'Mark complete for today' }}
      </UButton>

      <ReminderForm class="mt-6 block" :user-habit-id="id" />

      <button
        class="mx-auto mt-6 flex items-center gap-1.5 text-sm text-stone-400 hover:text-rose-500"
        @click="stopTracking"
      >
        <UIcon name="i-lucide-archive" class="size-4" /> Stop tracking
      </button>
    </template>
  </div>
</template>

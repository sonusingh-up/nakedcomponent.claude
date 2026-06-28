<script setup lang="ts">
const { fetchUserHabits } = useHabits()
const { fetchTodayLogs, logToday, removeTodayLog } = useHabitLogs()

// Client-side fetch (data is per-user and auth-gated).
const { data, pending, refresh } = await useAsyncData(
  'dashboard',
  async () => {
    const [habits, logs] = await Promise.all([
      fetchUserHabits(),
      fetchTodayLogs(),
    ])
    return { habits, logs }
  },
  { server: false, default: () => ({ habits: [], logs: {} as Record<string, any> }) },
)

const habits = computed(() => data.value?.habits ?? [])
const logs = computed(() => data.value?.logs ?? {})

const completedCount = computed(
  () => habits.value.filter((h) => logs.value[h.id]).length,
)
const progress = computed(() =>
  habits.value.length
    ? Math.round((completedCount.value / habits.value.length) * 100)
    : 0,
)

const greeting = ref('Good morning')
const today = ref('')

onMounted(() => {
  const h = new Date().getHours()
  if (h < 12) greeting.value = 'Good morning'
  else if (h < 18) greeting.value = 'Good afternoon'
  else greeting.value = 'Good evening'

  today.value = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
})

const toggling = ref<string | null>(null)
async function toggle(userHabitId: string) {
  toggling.value = userHabitId
  try {
    if (logs.value[userHabitId]) {
      await removeTodayLog(userHabitId)
    } else {
      await logToday(userHabitId)
      if (import.meta.client && navigator.vibrate) navigator.vibrate(15)
    }
    await refresh()
  } finally {
    toggling.value = null
  }
}
</script>

<template>
  <div>
    <header class="mb-6 mt-2">
      <p class="text-sm font-medium text-stone-500">{{ today }}</p>
      <h1 class="display-serif mt-1 text-4xl text-stone-900">
        {{ greeting }}
      </h1>
    </header>

    <!-- Progress summary -->
    <section
      v-if="habits.length"
      class="mb-6 rounded-3xl bg-terracotta-500 p-5 text-white shadow-md"
    >
      <div class="flex items-end justify-between">
        <div>
          <p class="text-sm/relaxed text-white/80">Today's progress</p>
          <p class="display-serif text-3xl">
            {{ completedCount }}<span class="text-white/60">/{{ habits.length }}</span>
          </p>
        </div>
        <p class="tabular text-4xl font-semibold">{{ progress }}%</p>
      </div>
      <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
        <div
          class="h-full rounded-full bg-white transition-all duration-500"
          :style="{ width: progress + '%' }"
        />
      </div>
    </section>

    <!-- Habit list -->
    <section v-if="pending" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-[68px] rounded-2xl" />
    </section>

    <section v-else-if="habits.length" class="space-y-3">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Your habits
        </h2>
        <UButton
          to="/discover"
          variant="ghost"
          size="xs"
          icon="i-lucide-plus"
          color="primary"
        >
          Add
        </UButton>
      </div>
      <HabitCard
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        :completed="!!logs[habit.id]"
        @toggle="toggle(habit.id)"
        @open="navigateTo(`/track/${habit.id}`)"
      />
    </section>

    <AppEmptyState
      v-else
      icon="i-lucide-sprout"
      title="Start your first habit"
      description="Browse habits that fit your lifestyle and start building streaks today."
      cta-label="Discover habits"
      cta-to="/discover"
    />
  </div>
</template>

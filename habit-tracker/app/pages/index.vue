<script setup lang="ts">
const { fetchUserHabits } = useHabits()
const { fetchTodayLogs, logToday, removeTodayLog, fetchHistoryAll } = useHabitLogs()
const user = useSupabaseUser()

// Client-side fetch (data is per-user and auth-gated).
const { data, pending, refresh } = await useAsyncData(
  'dashboard',
  async () => {
    const [habits, logs, history] = await Promise.all([
      fetchUserHabits(),
      fetchTodayLogs(),
      fetchHistoryAll(70),
    ])
    return { habits, logs, history }
  },
  {
    server: false,
    default: () => ({
      habits: [],
      logs: {} as Record<string, any>,
      history: {} as Record<string, Set<string>>,
    }),
  },
)

const habits = computed(() => data.value?.habits ?? [])
const logs = computed(() => data.value?.logs ?? {})
const history = computed(() => data.value?.history ?? {})

const completedCount = computed(
  () => habits.value.filter((h) => logs.value[h.id]).length,
)
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
    <!-- Gradient hero -->
    <section
      class="spark-gradient relative mt-1 overflow-hidden rounded-[28px] p-5 text-white shadow-xl shadow-ember-900/30"
    >
      <div class="flex items-center justify-between">
        <NuxtLink to="/settings" class="flex items-center gap-3">
          <span
            class="tabular flex size-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold ring-1 ring-white/30 backdrop-blur"
          >
            {{ initials }}
          </span>
        </NuxtLink>
        <div class="flex gap-2">
          <NuxtLink
            to="/discover"
            aria-label="Add habit"
            class="flex size-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 transition-colors hover:bg-white/25"
          >
            <UIcon name="i-lucide-plus" class="size-5" />
          </NuxtLink>
          <NuxtLink
            to="/settings"
            aria-label="Settings"
            class="flex size-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 transition-colors hover:bg-white/25"
          >
            <UIcon name="i-lucide-menu" class="size-5" />
          </NuxtLink>
        </div>
      </div>

      <p class="mt-5 text-sm font-medium text-white/85">
        {{ greeting }} {{ displayName }}
      </p>
      <h1 class="mt-1 text-[26px] font-semibold leading-tight tracking-tight">
        Keep the streak alive,<br />spark your daily motivation.
      </h1>

      <!-- Today's progress -->
      <div v-if="habits.length" class="mt-5">
        <div class="flex items-end justify-between text-sm">
          <span class="text-white/85">
            <span class="tabular text-lg font-bold">{{ completedCount }}</span>
            <span class="text-white/60">/{{ habits.length }}</span>
            today
          </span>
          <span class="tabular text-lg font-bold">{{ progress }}%</span>
        </div>
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
          <div
            class="h-full rounded-full bg-white transition-all duration-500"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>
    </section>

    <!-- Habit list -->
    <section v-if="pending" class="mt-6 space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-[150px] rounded-3xl" />
    </section>

    <section v-else-if="habits.length" class="mt-6 space-y-3">
      <div class="mb-1 flex items-center justify-between">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-stone-400">
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
        :history="history[habit.id]"
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

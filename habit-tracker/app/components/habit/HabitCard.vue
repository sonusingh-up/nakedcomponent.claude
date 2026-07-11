<script setup lang="ts">
import type { UserHabit } from '~/types'
import { localDate } from '~/composables/useHabitLogs'

const props = withDefaults(
  defineProps<{
    habit: UserHabit
    completed: boolean
    /** Set of YYYY-MM-DD dates this habit was completed (last ~70 days). */
    history?: Set<string>
  }>(),
  { history: () => new Set<string>() },
)

const emit = defineEmits<{ toggle: []; open: [] }>()

const WINDOW = 70 // 10 weeks of dots (7 rows x 10 cols)

const name = computed(
  () => props.habit.custom_name ?? props.habit.habit?.name ?? 'Habit',
)
const icon = computed(() => props.habit.habit?.icon ?? 'i-lucide-circle-dot')
const streak = computed(() => props.habit.streak?.current_streak ?? 0)

/** Oldest -> newest list of the last WINDOW days, flagged completed. */
const cells = computed(() => {
  const out: { date: string; done: boolean; today: boolean }[] = []
  const todayStr = localDate()
  const base = new Date()
  for (let i = WINDOW - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const ds = localDate(d)
    out.push({ date: ds, done: props.history.has(ds), today: ds === todayStr })
  }
  return out
})

const doneCount = computed(() => cells.value.filter((c) => c.done).length)
</script>

<template>
  <div
    class="glass rounded-3xl p-4 transition-colors hover:border-[var(--border-2)]"
  >
    <!-- Top row: streak badge + complete toggle -->
    <div class="flex items-center justify-between gap-3">
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
        :class="
          streak > 0
            ? 'bg-ember-500/15 text-ember-300'
            : 'bg-white/5 text-stone-400'
        "
      >
        <UIcon name="i-lucide-flame" class="size-3.5" />
        {{ streak }} day{{ streak === 1 ? '' : 's' }} streak
      </span>

      <button
        class="flex size-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200"
        :class="
          completed
            ? 'spark-gradient text-white shadow-md shadow-ember-500/30'
            : 'border border-white/15 text-transparent hover:border-ember-400/60'
        "
        :aria-label="completed ? 'Mark incomplete' : 'Mark complete'"
        @click="emit('toggle')"
      >
        <UIcon name="i-lucide-check" class="size-5" />
      </button>
    </div>

    <!-- Title (left) + heat grid (right) -->
    <div class="mt-3 flex items-center justify-between gap-4">
      <button class="min-w-0 flex-1 text-left" @click="emit('open')">
        <div class="flex items-center gap-2">
          <UIcon :name="icon" class="size-4 shrink-0 text-ember-400" />
          <h3 class="truncate text-lg font-semibold leading-tight text-stone-100">
            {{ name }}
          </h3>
        </div>
        <p class="tabular mt-1 text-xs text-stone-400">
          {{ doneCount }}/{{ WINDOW }} days completed
        </p>
      </button>

      <button
        class="grid shrink-0 grid-flow-col grid-rows-7 gap-[3px]"
        aria-label="Open habit history"
        @click="emit('open')"
      >
        <span
          v-for="cell in cells"
          :key="cell.date"
          class="size-2 rounded-[3px]"
          :class="[
            cell.done ? 'bg-ember-500' : 'bg-white/8',
            cell.today ? 'ring-1 ring-ember-300 ring-offset-1 ring-offset-[var(--color-coal-900)]' : '',
          ]"
        />
      </button>
    </div>
  </div>
</template>

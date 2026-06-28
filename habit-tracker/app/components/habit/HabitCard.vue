<script setup lang="ts">
import type { UserHabit } from '~/types'
import { localDate } from '~/composables/useHabitLogs'

const props = withDefaults(
  defineProps<{
    habit: UserHabit
    completed: boolean
    history?: Set<string>
  }>(),
  { history: () => new Set<string>() },
)

const emit = defineEmits<{ toggle: []; open: [] }>()

const WINDOW = 70

const name = computed(
  () => props.habit.custom_name ?? props.habit.habit?.name ?? 'Habit',
)
const icon = computed(() => props.habit.habit?.icon ?? 'i-lucide-circle-dot')
const streak = computed(() => props.habit.streak?.current_streak ?? 0)

// Keep the calculations for stats display
const doneCount = computed(() => {
  let count = 0
  const todayStr = localDate()
  const base = new Date()
  for (let i = WINDOW - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const ds = localDate(d)
    if (props.history.has(ds)) count++
  }
  return count
})
const completionPct = computed(() =>
  WINDOW > 0 ? Math.round((doneCount.value / WINDOW) * 100) : 0,
)
</script>

<template>
  <div
    class="flex items-center justify-between rounded-[13px] bg-white border border-stone-200 p-2.5 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer dark:border-transparent dark:bg-[#1c1c1c] dark:shadow-none"
    @click="emit('open')"
  >
    <!-- Left: Icon + Info -->
    <div class="flex items-center gap-2">
      <!-- Icon Wrapper -->
      <div class="flex size-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[#f97316]/15">
        <UIcon :name="icon" class="size-[15px] text-[#f97316]" />
      </div>

      <!-- Text Info -->
      <div>
        <div class="mb-[2px] text-[13px] font-medium text-stone-800 dark:text-white">{{ name }}</div>
        <div class="flex items-center gap-[3px] text-[11px] text-stone-400 dark:text-[#555]">
          <UIcon name="i-lucide-flame" class="size-[10px]" :class="streak > 0 ? 'text-[#f97316]' : ''" />
          {{ streak }}d · {{ doneCount }}/{{ WINDOW }} · {{ completionPct }}%
        </div>
      </div>
    </div>

    <!-- Right: Toggle Check -->
    <button
      class="flex size-[26px] shrink-0 items-center justify-center rounded-full transition-all outline-none"
      :class="completed ? 'bg-[#f97316]' : 'border-[1.5px] border-[#f97316]/40 hover:bg-[#f97316]/10 dark:border-[#f97316]/30 dark:hover:bg-[#f97316]/15'"
      :aria-label="completed ? 'Mark incomplete' : 'Mark complete'"
      @click.stop="emit('toggle')"
    >
      <UIcon v-if="completed" name="i-lucide-check" class="size-[13px] text-white" />
    </button>
  </div>
</template>

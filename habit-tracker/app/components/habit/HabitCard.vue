<script setup lang="ts">
import type { UserHabit } from '~/types'
import { localDate, displayStreak } from '~/composables/useHabitLogs'

const props = withDefaults(
  defineProps<{
    habit: UserHabit
    status: 'completed' | 'missed' | 'frozen' | null
    busy?: boolean
    history?: Record<string, string>
    isAtRisk?: boolean
    atRiskStreak?: number
    freezeHoursLeft?: number
  }>(),
  { history: () => ({}) },
)

const emit = defineEmits<{ toggle: []; open: []; freeze: [] }>()

const WINDOW = 70

const name = computed(
  () => props.habit.custom_name ?? props.habit.habit?.name ?? 'Habit',
)
const icon = computed(() => props.habit.habit?.icon ?? 'i-lucide-circle-dot')
const streak = computed(() => displayStreak(props.habit.streak))

// Keep the calculations for stats display
const doneCount = computed(() => {
  let count = 0
  const base = new Date()
  for (let i = WINDOW - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const ds = localDate(d)
    if (props.history[ds] === 'completed') count++
  }
  return count
})
const frozenCount = computed(() => {
  let count = 0
  const base = new Date()
  for (let i = WINDOW - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(base.getDate() - i)
    const ds = localDate(d)
    if (props.history[ds] === 'frozen') count++
  }
  return count
})
const completionPct = computed(() => {
  const eligibleDays = WINDOW - frozenCount.value
  return eligibleDays > 0 ? Math.round((doneCount.value / eligibleDays) * 100) : 0
})
</script>

<template>
  <div
    class="flex flex-col rounded-[13px] bg-white border border-stone-200 p-2.5 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer dark:border-transparent dark:bg-[#1c1c1c] dark:shadow-none"
    :class="{ 'border-[#f97316]/30': isAtRisk }"
    @click="emit('open')"
  >
    <div class="flex items-center justify-between">
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
            
            <template v-if="isAtRisk">
              <span class="text-[#f97316] font-medium">{{ atRiskStreak || streak }}d at risk</span>
              <span class="bg-[#f97316]/15 rounded-[3px] px-1 text-[#f97316]">!</span>
            </template>
            <template v-else-if="status === 'frozen'">
              <span>{{ streak }}d streak</span>
              <span class="inline-flex items-center gap-0.5 bg-sky-50 border border-sky-200 rounded px-1 text-blue-500 ml-1 dark:bg-[#0c1929] dark:border-[#1a3a5f] dark:text-blue-400">
                <UIcon name="i-lucide-snowflake" class="size-[9px]" /> frozen
              </span>
            </template>
            <template v-else>
              {{ streak }}d · {{ doneCount }}/{{ WINDOW }} · {{ completionPct }}%
            </template>
          </div>
        </div>
      </div>

      <!-- Right: Toggle Check or Freeze Button -->
      <button v-if="isAtRisk"
        class="bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1 text-blue-600 text-[11px] flex items-center gap-1 whitespace-nowrap dark:bg-[#0c1929] dark:border-[#1a3a5f] dark:text-blue-400"
        @click.stop="emit('freeze')"
      >
        <UIcon name="i-lucide-snowflake" class="size-[11px]" />
        Freeze
      </button>
      <div v-else-if="status === 'frozen'" class="flex size-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#333]">
        <!-- frozen state is a dimmed empty circle or special indicator -->
      </div>
      <button v-else
        class="flex size-[26px] shrink-0 items-center justify-center rounded-full transition-all outline-none"
        :class="status === 'completed' ? 'bg-[#f97316]' : 'border-[1.5px] border-[#f97316]/40 hover:bg-[#f97316]/10 dark:border-[#f97316]/30 dark:hover:bg-[#f97316]/15'"
        :aria-label="status === 'completed' ? 'Mark incomplete' : 'Mark complete'"
        :disabled="busy"
        @click.stop="emit('toggle')"
      >
        <UIcon
          v-if="busy"
          name="i-lucide-loader-2"
          class="size-[13px] animate-spin"
          :class="status === 'completed' ? 'text-white' : 'text-[#f97316]'"
        />
        <UIcon v-else-if="status === 'completed'" name="i-lucide-check" class="size-[13px] text-white" />
      </button>
    </div>
    
    <div v-if="isAtRisk" class="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-stone-100 rounded-md dark:bg-[#111]">
      <UIcon name="i-lucide-clock" class="size-3 text-stone-400 dark:text-[#777]" />
      <span class="text-stone-500 dark:text-[#666] text-[11px]">{{ freezeHoursLeft }} hrs left to use a freeze for yesterday</span>
    </div>
  </div>
</template>

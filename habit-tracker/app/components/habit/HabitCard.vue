<script setup lang="ts">
import type { UserHabit } from '~/types'

const props = defineProps<{
  habit: UserHabit
  completed: boolean
}>()

const emit = defineEmits<{ toggle: []; open: [] }>()

const name = computed(
  () => props.habit.custom_name ?? props.habit.habit?.name ?? 'Habit',
)
const color = computed(() => props.habit.habit?.color ?? '#c96442')
const icon = computed(() => props.habit.habit?.icon ?? 'i-lucide-circle-dot')
const streak = computed(() => props.habit.streak?.current_streak ?? 0)
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-2xl border border-[var(--color-cream-200)] bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
  >
    <div
      class="flex size-11 shrink-0 items-center justify-center rounded-xl"
      :style="{ backgroundColor: color + '1f', color }"
    >
      <UIcon :name="icon" class="size-6" />
    </div>

    <button class="min-w-0 flex-1 text-left" @click="emit('open')">
      <p class="truncate font-medium text-stone-800">{{ name }}</p>
      <p class="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
        <UIcon
          name="i-lucide-flame"
          class="size-3.5"
          :class="streak > 0 ? 'text-terracotta-500' : 'text-stone-300'"
        />
        <span class="tabular font-medium">{{ streak }}</span>
        day streak
      </p>
    </button>

    <button
      class="flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200"
      :class="
        completed
          ? 'border-terracotta-500 bg-terracotta-500 text-white'
          : 'border-stone-300 bg-transparent text-transparent hover:border-terracotta-400'
      "
      :aria-label="completed ? 'Mark incomplete' : 'Mark complete'"
      @click="emit('toggle')"
    >
      <UIcon name="i-lucide-check" class="size-5" />
    </button>
  </div>
</template>

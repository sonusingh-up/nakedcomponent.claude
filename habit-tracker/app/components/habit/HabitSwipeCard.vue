<script setup lang="ts">
import { CATEGORY_META, type Habit, type HabitCategory } from '~/types'

const props = defineProps<{
  habit: Habit
  intent?: 'accept' | 'reject' | null
  intentStrength?: number
}>()

const category = computed(
  () => CATEGORY_META[props.habit.category as HabitCategory],
)
const color = computed(() => props.habit.color)
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] bg-[var(--color-coal-900)] shadow-xl shadow-black/40 ring-1 ring-white/10 select-none"
  >
    <!-- Visual header with brand-tinted gradient + giant icon -->
    <div
      class="relative flex flex-1 items-center justify-center overflow-hidden"
      :style="{
        background: `linear-gradient(150deg, ${color}40 0%, ${color}1a 55%, #1a1512 100%)`,
      }"
    >
      <UIcon
        :name="habit.icon"
        class="size-32 opacity-90"
        :style="{ color }"
      />

      <!-- Category badge -->
      <div
        class="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold backdrop-blur"
        :style="{ color }"
      >
        <UIcon :name="category?.icon" class="size-3.5" />
        {{ category?.label }}
      </div>

      <!-- Social proof pill -->
      <div
        class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs backdrop-blur"
      >
        <UIcon name="i-lucide-users" class="size-3.5 text-stone-500" />
        <span class="tabular font-semibold text-stone-700">
          {{ habit.social_proof_count.toLocaleString() }}
        </span>
      </div>

      <!-- Swipe-intent overlays -->
      <div
        class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 -rotate-12 rounded-xl border-4 border-emerald-500 px-3 py-1 text-2xl font-extrabold uppercase tracking-wider text-emerald-500 transition-opacity"
        :style="{ opacity: intent === 'accept' ? (intentStrength ?? 0) : 0 }"
      >
        Add
      </div>
      <div
        class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 rotate-12 rounded-xl border-4 border-rose-500 px-3 py-1 text-2xl font-extrabold uppercase tracking-wider text-rose-500 transition-opacity"
        :style="{ opacity: intent === 'reject' ? (intentStrength ?? 0) : 0 }"
      >
        Skip
      </div>
    </div>

    <!-- Text content -->
    <div class="px-6 pb-6 pt-4">
      <h2 class="text-3xl font-semibold tracking-tight text-stone-100">{{ habit.name }}</h2>
      <p class="mt-2 text-sm/relaxed text-stone-300">{{ habit.description }}</p>
      <p class="mt-3 text-xs text-stone-400">
        <span class="tabular font-medium text-stone-200">
          {{ habit.social_proof_count.toLocaleString() }}
        </span>
        people are building this habit
      </p>
    </div>
  </div>
</template>

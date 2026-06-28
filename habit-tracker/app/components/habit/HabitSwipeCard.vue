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
    class="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-white shadow-xl shadow-stone-200/50 ring-1 ring-stone-200 select-none dark:bg-[#151515] dark:shadow-black/50 dark:ring-white/[0.08]"
  >
    <!-- Visual header with brand-tinted gradient + giant icon -->
    <div
      class="relative flex flex-1 items-center justify-center overflow-hidden"
      :style="{
        background: `linear-gradient(150deg, ${color}2a 0%, ${color}0a 60%, transparent 100%)`,
      }"
    >
      <!-- Background glow -->
      <div 
        class="absolute inset-0 opacity-40 mix-blend-screen blur-[80px]"
        :style="{ background: `radial-gradient(circle at center, ${color}, transparent 60%)` }"
      />

      <UIcon
        :name="habit.icon"
        class="relative z-10 size-28 opacity-90 drop-shadow-[0_8px_32px_rgba(255,106,24,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        :style="{ color }"
      />

      <!-- Category badge -->
      <div
        class="absolute left-5 top-5 flex items-center gap-1.5 rounded-[8px] bg-white/40 px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-black/5 backdrop-blur dark:bg-black/20 dark:ring-white/10"
        :style="{ color }"
      >
        <UIcon :name="category?.icon" class="size-3.5" />
        {{ category?.label }}
      </div>

      <!-- Social proof pill -->
      <div
        class="absolute right-5 top-5 flex items-center gap-1.5 rounded-[8px] bg-white/40 px-2.5 py-1 text-[11px] ring-1 ring-black/5 backdrop-blur dark:bg-black/20 dark:ring-white/10"
      >
        <UIcon name="i-lucide-users" class="size-3.5 text-stone-600 dark:text-stone-300" />
        <span class="tabular font-semibold text-stone-800 dark:text-stone-100">
          {{ habit.social_proof_count.toLocaleString() }}
        </span>
      </div>

      <!-- Swipe-intent overlays -->
      <div
        class="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 -rotate-12 rounded-[12px] border-[3px] border-emerald-500 px-4 py-1.5 text-xl font-bold uppercase tracking-widest text-emerald-500 transition-opacity"
        :style="{ opacity: intent === 'accept' ? (intentStrength ?? 0) : 0 }"
      >
        Add
      </div>
      <div
        class="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 rotate-12 rounded-[12px] border-[3px] border-rose-500 px-4 py-1.5 text-xl font-bold uppercase tracking-widest text-rose-500 transition-opacity"
        :style="{ opacity: intent === 'reject' ? (intentStrength ?? 0) : 0 }"
      >
        Skip
      </div>
    </div>

    <!-- Text content -->
    <div class="px-6 pb-7 pt-5 relative z-10 bg-gradient-to-t from-white via-white to-transparent dark:from-[#151515] dark:via-[#151515]">
      <h2 class="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-stone-900 dark:text-stone-50">{{ habit.name }}</h2>
      <p class="mt-2 text-[14px] leading-relaxed text-stone-500 dark:text-stone-300/90">{{ habit.description }}</p>
      <div class="mt-4 flex items-center gap-2">
        <div class="flex -space-x-1">
          <div v-for="i in 3" :key="i" class="size-5 rounded-full bg-stone-200 ring-2 ring-white dark:bg-stone-700 dark:ring-[#151515]"></div>
        </div>
        <p class="text-[12px] text-stone-400 dark:text-stone-500">
          <span class="tabular font-medium text-stone-700 dark:text-stone-300">
            {{ habit.social_proof_count.toLocaleString() }}
          </span>
          building this
        </p>
      </div>
    </div>
  </div>
</template>

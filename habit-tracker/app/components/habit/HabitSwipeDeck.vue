<script setup lang="ts">
import type { Habit } from '~/types'

const props = defineProps<{ habits: Habit[] }>()
const emit = defineEmits<{ accept: [habit: Habit]; reject: [habit: Habit] }>()

const index = ref(0)
const current = computed<Habit | undefined>(() => props.habits[index.value])
const upcoming = computed<Habit | undefined>(() => props.habits[index.value + 1])
const done = computed(() => index.value >= props.habits.length)

// Reset the deck whenever the source list changes (e.g. category switch).
watch(
  () => props.habits,
  () => {
    index.value = 0
  },
)

const { x, tilt, style, handlers, fly, leaving } = useSwipeGesture({
  onAccept: () => {
    const h = current.value
    index.value++
    if (h) emit('accept', h)
  },
  onReject: () => {
    const h = current.value
    index.value++
    if (h) emit('reject', h)
  },
})

const intent = computed<'accept' | 'reject' | null>(() =>
  x.value > 4 ? 'accept' : x.value < -4 ? 'reject' : null,
)
</script>

<template>
  <div>
    <div class="relative mx-auto h-[55vh] max-h-[480px] w-full max-w-[340px]">
      <!-- Card behind (peek) -->
      <div
        v-if="upcoming"
        class="absolute inset-0 scale-[0.95] opacity-60 transition-all duration-300"
        style="transform-origin: top center"
      >
        <HabitSwipeCard :habit="upcoming" />
      </div>

      <!-- Top, draggable card -->
      <div
        v-if="current"
        class="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        :style="style"
        v-bind="handlers"
      >
        <HabitSwipeCard
          :habit="current"
          :intent="intent"
          :intent-strength="tilt"
        />
      </div>

      <!-- Deck exhausted -->
      <div
        v-else
        class="absolute inset-0 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-stone-200 bg-stone-50 text-center dark:border-white/10 dark:bg-white/[0.02]"
      >
        <div class="flex size-14 items-center justify-center rounded-full bg-stone-200 dark:bg-white/[0.04]">
          <UIcon name="i-lucide-party-popper" class="size-6 text-stone-500 dark:text-stone-400" />
        </div>
        <p class="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-stone-800 dark:text-stone-200">You're all caught up</p>
        <p class="mt-1.5 text-[13px] text-stone-500">No more habits in this category.</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div v-if="current" class="mt-8 flex items-center justify-center gap-5">
      <button
        class="flex size-14 items-center justify-center rounded-[20px] bg-stone-100 text-stone-500 ring-1 ring-inset ring-stone-200 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:bg-stone-200 hover:text-stone-700 active:scale-95 disabled:opacity-50 dark:bg-white/[0.03] dark:text-stone-400 dark:ring-white/[0.05] dark:shadow-none dark:hover:bg-white/[0.06] dark:hover:text-stone-300"
        aria-label="Skip"
        :disabled="!!leaving"
        @click="fly('left')"
      >
        <UIcon name="i-lucide-x" class="size-6" />
      </button>
      
      <button
        class="spark-gradient group relative flex size-[68px] items-center justify-center rounded-[24px] text-white shadow-[0_2px_16px_rgba(255,106,24,0.3)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_4px_24px_rgba(255,106,24,0.4)] active:scale-95 disabled:opacity-50"
        aria-label="Add habit"
        :disabled="!!leaving"
        @click="fly('right')"
      >
        <div class="absolute inset-0 rounded-[24px] bg-white/0 transition-colors group-hover:bg-white/10" />
        <UIcon name="i-lucide-check" class="relative z-10 size-8 drop-shadow-sm" />
      </button>
    </div>
  </div>
</template>

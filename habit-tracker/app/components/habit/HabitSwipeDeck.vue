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
    <div class="relative mx-auto h-[60vh] max-h-[520px] w-full max-w-sm">
      <!-- Card behind (peek) -->
      <div
        v-if="upcoming"
        class="absolute inset-0 scale-[0.94] opacity-70"
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
        class="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/15 text-center"
      >
        <UIcon name="i-lucide-party-popper" class="size-12 text-ember-400" />
        <p class="mt-3 text-2xl font-semibold text-stone-100">You're all caught up</p>
        <p class="mt-1 text-sm text-stone-400">No more habits in this category.</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div v-if="current" class="mt-6 flex items-center justify-center gap-6">
      <button
        class="glass flex size-16 items-center justify-center rounded-full text-rose-400 shadow-lg shadow-black/30 transition-transform active:scale-90"
        aria-label="Skip"
        :disabled="!!leaving"
        @click="fly('left')"
      >
        <UIcon name="i-lucide-x" class="size-7" />
      </button>
      <button
        class="spark-gradient flex size-20 items-center justify-center rounded-full text-white shadow-lg shadow-ember-500/30 transition-transform active:scale-90"
        aria-label="Add habit"
        :disabled="!!leaving"
        @click="fly('right')"
      >
        <UIcon name="i-lucide-check" class="size-9" />
      </button>
    </div>
  </div>
</template>

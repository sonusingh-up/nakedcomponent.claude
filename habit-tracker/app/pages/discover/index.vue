<script setup lang="ts">
import { CATEGORY_META, type Habit, type HabitCategory } from '~/types'

const { fetchCatalog, fetchUserHabits, adoptHabit } = useHabits()
const toast = useToast()

const activeCategory = ref<HabitCategory | 'all'>('all')
const categories = Object.keys(CATEGORY_META) as HabitCategory[]

const { data, pending, refresh } = useAsyncData(
  'discover',
  async () => {
    const [catalog, mine] = await Promise.all([fetchCatalog(), fetchUserHabits()])
    return { catalog, adoptedIds: new Set(mine.map((h) => h.habit_id)) }
  },
  { server: false, default: () => ({ catalog: [], adoptedIds: new Set<string>() }) },
)

// Cards = catalog minus already-adopted, filtered by category.
const deck = computed<Habit[]>(() => {
  const adopted = data.value?.adoptedIds ?? new Set<string>()
  return (data.value?.catalog ?? [])
    .filter((h) => !adopted.has(h.id))
    .filter((h) => activeCategory.value === 'all' || h.category === activeCategory.value)
})

async function onAccept(habit: Habit) {
  if (import.meta.client && navigator.vibrate) navigator.vibrate(15)
  try {
    await adoptHabit(habit.id)
    data.value?.adoptedIds.add(habit.id)
    toast.add({
      title: `Added "${habit.name}"`,
      description: 'Find it on your home screen.',
      icon: 'i-lucide-check',
      color: 'primary',
    })
  } catch (e: any) {
    toast.add({ title: 'Could not add habit', description: e.message, color: 'error' })
  }
}

function onReject(_habit: Habit) {
  if (import.meta.client && navigator.vibrate) navigator.vibrate(8)
}

// Drag-to-scroll logic for category filters
const scrollContainer = ref<HTMLElement | null>(null)
let isDown = false
let startX: number
let scrollLeft: number

function onMouseDown(e: MouseEvent) {
  if (!scrollContainer.value) return
  isDown = true
  scrollContainer.value.classList.add('cursor-grabbing')
  scrollContainer.value.classList.remove('cursor-grab')
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft = scrollContainer.value.scrollLeft
}

function onMouseLeave() {
  isDown = false
  if (!scrollContainer.value) return
  scrollContainer.value.classList.remove('cursor-grabbing')
  scrollContainer.value.classList.add('cursor-grab')
}

function onMouseUp() {
  isDown = false
  if (!scrollContainer.value) return
  scrollContainer.value.classList.remove('cursor-grabbing')
  scrollContainer.value.classList.add('cursor-grab')
}

function onMouseMove(e: MouseEvent) {
  if (!isDown || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX) * 2 // Scroll speed multiplier
  scrollContainer.value.scrollLeft = scrollLeft - walk
}
</script>

<template>
  <div class="px-2">
    <header class="mb-6 mt-4 flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-[-0.02em] text-stone-100">Discover</h1>
        <p class="mt-1 text-[13px] font-medium text-stone-400">
          Swipe right to add, left to skip
        </p>
      </div>
      <NuxtLink
        to="/discover/new"
        class="flex size-10 items-center justify-center rounded-[10px] bg-white/[0.04] ring-1 ring-white/10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:bg-white/[0.08]"
        aria-label="Create custom habit"
      >
        <UIcon name="i-lucide-plus" class="size-[18px] text-stone-300" />
      </NuxtLink>
    </header>

    <!-- Category filter (Drag to scroll) -->
    <div
      ref="scrollContainer"
      class="no-scrollbar cursor-grab select-none -mx-6 mb-8 flex gap-2.5 overflow-x-auto px-6 pb-2"
      @mousedown="onMouseDown"
      @mouseleave="onMouseLeave"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
    >
      <button
        class="shrink-0 rounded-[12px] px-5 py-2.5 text-[14px] font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        :class="
          activeCategory === 'all'
            ? 'spark-gradient text-white shadow-[0_2px_12px_rgba(255,106,24,0.3)] hover:shadow-[0_4px_16px_rgba(255,106,24,0.4)]'
            : 'bg-white/[0.04] text-stone-300 ring-1 ring-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:ring-white/[0.12]'
        "
        @click="activeCategory = 'all'"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="flex shrink-0 items-center gap-2 rounded-[12px] px-5 py-2.5 text-[14px] font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        :class="
          activeCategory === cat
            ? 'spark-gradient text-white shadow-[0_2px_12px_rgba(255,106,24,0.3)] hover:shadow-[0_4px_16px_rgba(255,106,24,0.4)]'
            : 'bg-white/[0.04] text-stone-300 ring-1 ring-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:ring-white/[0.12]'
        "
        @click="activeCategory = cat"
      >
        <UIcon :name="CATEGORY_META[cat].icon" class="size-[16px] opacity-80" />
        {{ CATEGORY_META[cat].label }}
      </button>
    </div>

    <div v-if="pending" class="mx-auto h-[60vh] max-h-[520px] w-full max-w-sm">
      <USkeleton class="h-full w-full rounded-[24px] bg-white/[0.02] ring-1 ring-white/[0.05]" />
    </div>

    <HabitSwipeDeck
      v-else
      :key="activeCategory"
      :habits="deck"
      @accept="onAccept"
      @reject="onReject"
    />
  </div>
</template>

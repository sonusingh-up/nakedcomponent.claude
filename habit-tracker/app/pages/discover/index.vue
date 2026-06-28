<script setup lang="ts">
import { CATEGORY_META, type Habit, type HabitCategory } from '~/types'

const { fetchCatalog, fetchUserHabits, adoptHabit } = useHabits()
const toast = useToast()

const activeCategory = ref<HabitCategory | 'all'>('all')
const categories = Object.keys(CATEGORY_META) as HabitCategory[]

const { data, pending, refresh } = await useAsyncData(
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
</script>

<template>
  <div>
    <header class="mb-4 mt-2 flex items-start justify-between">
      <div>
        <h1 class="display-serif text-4xl text-stone-900">Discover</h1>
        <p class="mt-1 text-sm text-stone-500">
          Swipe right to add, left to skip
        </p>
      </div>
      <UButton
        to="/discover/new"
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        class="mt-1"
      />
    </header>

    <!-- Category filter -->
    <div class="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
      <button
        class="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeCategory === 'all'
            ? 'bg-stone-800 text-white'
            : 'border border-[var(--color-cream-200)] bg-white text-stone-600'
        "
        @click="activeCategory = 'all'"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeCategory === cat
            ? 'bg-stone-800 text-white'
            : 'border border-[var(--color-cream-200)] bg-white text-stone-600'
        "
        @click="activeCategory = cat"
      >
        <UIcon :name="CATEGORY_META[cat].icon" class="size-4" />
        {{ CATEGORY_META[cat].label }}
      </button>
    </div>

    <div v-if="pending" class="mx-auto h-[60vh] max-h-[520px] w-full max-w-sm">
      <USkeleton class="h-full w-full rounded-[2rem]" />
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

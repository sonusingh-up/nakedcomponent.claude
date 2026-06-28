<script setup lang="ts">
import { CATEGORY_META, type Habit, type HabitCategory } from '~/types'

const { fetchCatalog, fetchUserHabits, adoptHabit } = useHabits()
const toast = useToast()

const activeCategory = ref<HabitCategory | 'all'>('all')
const categories = Object.keys(CATEGORY_META) as HabitCategory[]

const { data, pending, refresh } = await useAsyncData(
  'discover',
  async () => {
    const [catalog, mine] = await Promise.all([
      fetchCatalog(),
      fetchUserHabits(),
    ])
    return { catalog, adoptedIds: new Set(mine.map((h) => h.habit_id)) }
  },
  { server: false, default: () => ({ catalog: [], adoptedIds: new Set<string>() }) },
)

const visible = computed<Habit[]>(() => {
  const list = data.value?.catalog ?? []
  return activeCategory.value === 'all'
    ? list
    : list.filter((h) => h.category === activeCategory.value)
})

const adopting = ref<string | null>(null)
async function adopt(habit: Habit) {
  adopting.value = habit.id
  try {
    await adoptHabit(habit.id)
    toast.add({
      title: `Added "${habit.name}"`,
      description: 'Find it on your home screen.',
      icon: 'i-lucide-check',
      color: 'primary',
    })
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Could not add habit', description: e.message, color: 'error' })
  } finally {
    adopting.value = null
  }
}

function isAdopted(id: string) {
  return data.value?.adoptedIds.has(id) ?? false
}
</script>

<template>
  <div>
    <header class="mb-4 mt-2">
      <h1 class="display-serif text-4xl text-stone-900">Discover</h1>
      <p class="mt-1 text-sm text-stone-500">Choose a habit you want to build</p>
    </header>

    <!-- Category filter -->
    <div class="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
      <button
        class="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeCategory === 'all'
            ? 'bg-stone-800 text-white'
            : 'bg-white text-stone-600 border border-[var(--color-cream-200)]'
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
            : 'bg-white text-stone-600 border border-[var(--color-cream-200)]'
        "
        @click="activeCategory = cat"
      >
        <UIcon :name="CATEGORY_META[cat].icon" class="size-4" />
        {{ CATEGORY_META[cat].label }}
      </button>
    </div>

    <section v-if="pending" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-44 rounded-3xl" />
    </section>

    <section v-else class="space-y-4">
      <article
        v-for="habit in visible"
        :key="habit.id"
        class="overflow-hidden rounded-3xl border border-[var(--color-cream-200)] bg-white shadow-sm"
      >
        <div
          class="flex items-center gap-2 px-5 pt-5"
          :style="{ color: habit.color }"
        >
          <UIcon :name="habit.icon" class="size-5" />
          <span class="text-xs font-semibold uppercase tracking-wide">
            {{ CATEGORY_META[habit.category as HabitCategory]?.label }}
          </span>
        </div>

        <div class="px-5 pb-4 pt-2">
          <h2 class="display-serif text-2xl text-stone-900">{{ habit.name }}</h2>
          <p class="mt-1.5 text-sm/relaxed text-stone-500">{{ habit.description }}</p>

          <div class="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
            <UIcon name="i-lucide-users" class="size-3.5" />
            <span class="tabular font-medium text-stone-600">
              {{ habit.social_proof_count.toLocaleString() }}
            </span>
            chose this habit
          </div>
        </div>

        <div class="border-t border-[var(--color-cream-200)] p-3">
          <UButton
            v-if="!isAdopted(habit.id)"
            block
            color="primary"
            :loading="adopting === habit.id"
            icon="i-lucide-plus"
            @click="adopt(habit)"
          >
            Add to my habits
          </UButton>
          <div
            v-else
            class="flex items-center justify-center gap-2 py-2 text-sm font-medium text-terracotta-600"
          >
            <UIcon name="i-lucide-check-circle-2" class="size-5" />
            Already tracking
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

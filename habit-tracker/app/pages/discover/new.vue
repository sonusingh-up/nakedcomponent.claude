<script setup lang="ts">
import type { HabitCategory } from '~/types'
import { CATEGORY_META } from '~/types'

const router = useRouter()
const { createCustomHabit } = useHabits()
const toast = useToast()

const form = reactive({
  name: '',
  description: '',
  category: 'fitness' as HabitCategory,
  icon: 'i-lucide-star',
})

const loading = ref(false)

const ICONS = [
  'i-lucide-star',
  'i-lucide-activity',
  'i-lucide-heart',
  'i-lucide-zap',
  'i-lucide-flame',
  'i-lucide-droplet',
  'i-lucide-book',
  'i-lucide-pen-tool',
  'i-lucide-dumbbell',
  'i-lucide-brain',
  'i-lucide-moon',
  'i-lucide-music',
  'i-lucide-camera',
  'i-lucide-smile',
]

const categories = Object.entries(CATEGORY_META).map(([value, meta]) => ({
  value,
  label: meta.label,
  icon: meta.icon,
}))

async function save() {
  const trimmedName = form.name.trim()
  if (!trimmedName) {
    toast.add({ title: 'Please enter a habit name', color: 'warning' })
    return
  }

  loading.value = true
  try {
    await createCustomHabit({
      name: trimmedName,
      description: form.description.trim() || null,
      category: form.category,
      icon: form.icon,
      color: CATEGORY_META[form.category].tint,
    })
    
    toast.add({
      title: 'Custom habit created!',
      description: 'You can now find it on your dashboard.',
      icon: 'i-lucide-check',
      color: 'primary',
    })
    
    // Go back to the dashboard since it's already adopted
    router.push('/')
  } catch (e: any) {
    toast.add({ title: 'Failed to create habit', description: e.message, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Sticky header matching other sub-pages -->
    <header
      class="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-between bg-[var(--color-cream-100)]/90 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8"
    >
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        class="-ml-2"
        @click="router.back()"
      />
      <h1 class="font-semibold text-stone-900">Create Custom Habit</h1>
      <div class="w-8" /> <!-- spacer -->
    </header>

    <div class="space-y-6">
      <section class="rounded-[3rem] border border-[var(--color-cream-200)] bg-white p-6 shadow-sm">
        <div class="space-y-5">
          <!-- Name -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-stone-700">Habit Name</label>
            <UInput
              v-model="form.name"
              placeholder="e.g. Read 10 pages"
              size="xl"
              class="rounded-full [&_input]:rounded-full"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-stone-700">Description <span class="font-normal text-stone-400">(Optional)</span></label>
            <UInput
              v-model="form.description"
              placeholder="Why are you doing this?"
              size="lg"
              class="rounded-full [&_input]:rounded-full"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-stone-700">Category</label>
            <select
              v-model="form.category"
              class="w-full rounded-full border border-[var(--color-cream-200)] bg-white px-4 py-2.5 text-sm text-stone-700 focus:border-terracotta-400 focus:outline-none"
            >
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Icon selection -->
          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Icon</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="icon in ICONS"
                :key="icon"
                type="button"
                class="flex size-12 items-center justify-center rounded-full border transition-colors"
                :class="form.icon === icon ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-600' : 'border-[var(--color-cream-200)] text-stone-400 hover:bg-stone-50'"
                @click="form.icon = icon"
              >
                <UIcon :name="icon" class="size-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <UButton
        block
        size="xl"
        color="primary"
        variant="solid"
        class="rounded-full px-6 py-3.5 text-base font-medium shadow-sm"
        icon="i-lucide-check"
        :loading="loading"
        @click="save"
      >
        Create Habit
      </UButton>
    </div>
  </div>
</template>

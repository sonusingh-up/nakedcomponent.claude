<script setup lang="ts">
const { list, remove } = useJournal()

const { data, pending, refresh } = await useAsyncData('journal', () => list(), {
  server: false,
  default: () => [],
})

const search = ref('')
const entries = computed(() => {
  const all = data.value ?? []
  const q = search.value.trim().toLowerCase()
  if (!q) return all
  return all.filter(
    (e) =>
      (e.title ?? '').toLowerCase().includes(q) ||
      (e.body ?? '').toLowerCase().includes(q),
  )
})

async function onDelete(id: string) {
  await remove(id)
  await refresh()
}
</script>

<template>
  <div>
    <header class="mb-4 mt-2">
      <h1 class="display-serif text-4xl text-stone-900">Journal</h1>
      <p class="mt-1 text-sm text-stone-500">Notes & audio for your habits</p>
    </header>

    <UInput
      v-model="search"
      placeholder="Search notes…"
      icon="i-lucide-search"
      size="lg"
      class="mb-4 w-full"
    />

    <div v-if="pending" class="columns-2 gap-3">
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="mb-3 rounded-2xl"
        :style="{ height: 80 + i * 12 + 'px' }"
      />
    </div>

    <div v-else-if="entries.length" class="columns-2 gap-3">
      <JournalEntry
        v-for="e in entries"
        :key="e.id"
        :entry="e"
        @delete="onDelete(e.id)"
      />
    </div>

    <AppEmptyState
      v-else
      icon="i-lucide-notebook-pen"
      title="No entries yet"
      description="Capture a quick note or a voice memo about how a habit is going."
      cta-label="New entry"
      cta-to="/journal/new"
    />

    <!-- Floating add button -->
    <NuxtLink
      to="/journal/new"
      class="fixed bottom-24 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-lg transition-transform active:scale-90"
      aria-label="New entry"
    >
      <UIcon name="i-lucide-plus" class="size-7" />
    </NuxtLink>
  </div>
</template>

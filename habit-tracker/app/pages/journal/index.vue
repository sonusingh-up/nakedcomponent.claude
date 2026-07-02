<script setup lang="ts">
const { list, remove, update } = useJournal()
const toast = useToast()

const { data, pending, refresh } = useAsyncData('journal', () => list(), {
  server: false,
  lazy: true,
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

async function onDelete(entry: { id: string; audio_url?: string | null; image_url?: string | null }) {
  if (!confirm('Delete this entry? This cannot be undone.')) return
  try {
    await remove(entry)
    await refresh()
  } catch (e: any) {
    toast.add({ title: 'Could not delete entry', description: e.message, color: 'error' })
  }
}

async function onUpdate(id: string, updates: { title?: string | null; body?: string | null }) {
  try {
    await update(id, updates)
    await refresh()
    toast.add({ title: 'Entry updated', icon: 'i-lucide-check', color: 'primary' })
  } catch (e: any) {
    toast.add({ title: 'Could not update entry', description: e.message, color: 'error' })
  }
}
</script>

<template>
  <div>
    <header class="mb-6 mt-4">
      <h1 class="text-3xl font-semibold tracking-[-0.02em] text-stone-900 dark:text-stone-100">Journal</h1>
      <p class="mt-1 text-[13px] font-medium text-stone-500 dark:text-stone-400">Notes & audio for your habits</p>
    </header>

    <UInput
      v-model="search"
      placeholder="Search notes…"
      icon="i-lucide-search"
      size="lg"
      variant="none"
      class="mb-6 w-full rounded-[16px] bg-black/5 ring-1 ring-inset ring-black/10 dark:bg-white/[0.03] dark:ring-white/[0.08]"
    />

    <div v-if="pending" class="columns-2 gap-3">
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="mb-3 rounded-2xl"
        :style="{ height: 80 + i * 12 + 'px' }"
      />
    </div>

    <div v-else-if="entries.length" class="columns-2 gap-4">
      <JournalEntry
        v-for="e in entries"
        :key="e.id"
        :entry="e"
        @delete="onDelete(e)"
        @update="onUpdate(e.id, $event)"
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
      class="spark-gradient group fixed bottom-28 right-6 z-30 flex size-[60px] items-center justify-center rounded-full text-white shadow-[0_2px_16px_rgba(255,106,24,0.3)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105 hover:shadow-[0_4px_24px_rgba(255,106,24,0.4)] active:scale-95"
      aria-label="New entry"
    >
      <div class="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/10" />
      <UIcon name="i-lucide-plus" class="relative z-10 size-8 drop-shadow-sm" />
    </NuxtLink>
  </div>
</template>

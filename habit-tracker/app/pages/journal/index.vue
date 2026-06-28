<script setup lang="ts">
// Full journal (text + audio entries, masonry grid, search) lands in Phase 6.
</script>

<template>
  <div>
    <header class="mb-4 mt-2 flex items-end justify-between">
      <div>
        <h1 class="display-serif text-4xl text-stone-900">Journal</h1>
        <p class="mt-1 text-sm text-stone-500">Notes & audio for your habits</p>
      </div>
    </header>

    <AppEmptyState
      icon="i-lucide-notebook-pen"
      title="Your journal is empty"
      description="Soon you'll be able to capture quick notes and voice memos against each habit. Coming next."
    />
  </div>
</template>

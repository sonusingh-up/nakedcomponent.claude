<script setup lang="ts">
// Main app shell: scrollable content area + fixed bottom navigation.
</script>

<template>
  <div class="app-shell flex min-h-[100dvh] flex-col bg-[var(--color-cream-100)]">
    <main class="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-4">
      <slot />
    </main>
    <AppInstallBanner />
    <AppBottomNav />
  </div>
</template>

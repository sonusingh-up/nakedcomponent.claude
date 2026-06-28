<script setup lang="ts">
// Main app shell: dark canvas + ember glow, scrollable content, floating nav.
</script>

<template>
  <div class="app-shell relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-[var(--color-coal-1000)]">
    <!-- Ambient ember glow behind the top of every screen -->
    <div class="ember-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-80" />

    <main class="mx-auto w-full max-w-lg flex-1 px-4 pb-32 pt-5">
      <slot />
    </main>

    <AppInstallBanner />
    <AppBottomNav />
  </div>
</template>

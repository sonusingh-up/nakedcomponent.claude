<script setup lang="ts">
// Bare layout for auth / onboarding screens — no bottom nav.
</script>

<template>
  <div class="app-shell relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--color-coal-1000)]">
    <div class="ember-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
    <div class="mx-auto flex w-full max-w-md flex-1 flex-col px-6">
      <slot />
    </div>
  </div>
</template>

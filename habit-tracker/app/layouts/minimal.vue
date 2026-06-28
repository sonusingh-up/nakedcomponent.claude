<script setup lang="ts">
// Bare layout for auth / onboarding screens — no bottom nav.
</script>

<template>
  <div class="app-shell flex min-h-[100dvh] flex-col bg-[var(--color-cream-100)]">
    <div class="mx-auto flex w-full max-w-md flex-1 flex-col px-6">
      <slot />
    </div>
  </div>
</template>

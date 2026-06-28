<script setup lang="ts">
// UApp provides Nuxt UI's global overlays, toasts and tooltips context.
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#f97316" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

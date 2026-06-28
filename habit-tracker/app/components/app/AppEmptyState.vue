<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
  ctaLabel?: string
  ctaTo?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div
      class="mb-5 flex size-16 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-600"
    >
      <UIcon :name="icon ?? 'i-lucide-sparkles'" class="size-8" />
    </div>
    <h2 class="display-serif text-2xl text-stone-800">{{ title }}</h2>
    <p v-if="description" class="mt-2 max-w-xs text-sm text-stone-500">
      {{ description }}
    </p>
    <UButton
      v-if="ctaLabel && ctaTo"
      :to="ctaTo"
      class="mt-6"
      color="primary"
      icon="i-lucide-arrow-right"
      trailing
    >
      {{ ctaLabel }}
    </UButton>
  </div>
</template>

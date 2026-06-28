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
      class="mb-5 flex size-16 items-center justify-center rounded-2xl bg-ember-500/15 text-ember-300"
    >
      <UIcon :name="icon ?? 'i-lucide-sparkles'" class="size-8" />
    </div>
    <h2 class="text-2xl font-semibold text-stone-100">{{ title }}</h2>
    <p v-if="description" class="mt-2 max-w-xs text-sm text-stone-400">
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

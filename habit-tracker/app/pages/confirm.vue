<script setup lang="ts">
definePageMeta({ layout: 'minimal' })

// Landing page for magic-link / email-confirmation redirects.
// @nuxtjs/supabase processes the token client-side and populates the user;
// we just wait and forward to the dashboard.
const user = useSupabaseUser()

watch(
  user,
  (u) => {
    if (u) navigateTo('/')
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-4">
    <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-ember-400" />
    <p class="text-sm text-stone-400">Signing you in…</p>
  </div>
</template>

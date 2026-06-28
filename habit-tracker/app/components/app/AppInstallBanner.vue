<script setup lang="ts">
const { $installPrompt } = useNuxtApp() as any
const dismissed = ref(false)

onMounted(() => {
  dismissed.value = localStorage.getItem('pwa-install-dismissed') === '1'
})

const show = computed(
  () => !dismissed.value && $installPrompt?.canInstall?.value,
)

function dismiss() {
  dismissed.value = true
  localStorage.setItem('pwa-install-dismissed', '1')
}
</script>

<template>
  <Transition name="page">
    <div
      v-if="show"
      class="fixed inset-x-3 bottom-24 z-40 flex items-center gap-3 rounded-2xl border border-[var(--color-cream-200)] bg-white p-3 shadow-lg"
    >
      <div
        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-terracotta-500 text-white"
      >
        <UIcon name="i-lucide-download" class="size-5" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-stone-800">Install Habit Tracker</p>
        <p class="truncate text-xs text-stone-500">Add to your home screen</p>
      </div>
      <UButton size="sm" color="primary" @click="$installPrompt.prompt()">
        Install
      </UButton>
      <button
        class="text-stone-400 hover:text-stone-600"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <UIcon name="i-lucide-x" class="size-5" />
      </button>
    </div>
  </Transition>
</template>

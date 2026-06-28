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
      class="glass fixed inset-x-3 bottom-28 z-40 flex items-center gap-3 rounded-2xl p-3 shadow-lg shadow-black/40"
    >
      <div
        class="spark-gradient flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
      >
        <UIcon name="i-lucide-download" class="size-5" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-stone-100">Install Habit Tracker</p>
        <p class="truncate text-xs text-stone-400">Add to your home screen</p>
      </div>
      <UButton size="sm" color="primary" @click="$installPrompt.prompt()">
        Install
      </UButton>
      <button
        class="text-stone-400 hover:text-stone-200"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <UIcon name="i-lucide-x" class="size-5" />
      </button>
    </div>
  </Transition>
</template>

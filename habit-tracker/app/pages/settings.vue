<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const displayName = computed(
  () =>
    (user.value?.user_metadata?.display_name as string) ||
    user.value?.email?.split('@')[0] ||
    'there',
)

const signingOut = ref(false)
async function signOut() {
  signingOut.value = true
  const { error } = await supabase.auth.signOut()
  signingOut.value = false
  if (error) {
    toast.add({ title: 'Sign out failed', description: error.message, color: 'error' })
    return
  }
  await navigateTo('/login')
}
</script>

<template>
  <div>
    <header class="mb-6 mt-2">
      <h1 class="display-serif text-4xl text-stone-900">Settings</h1>
    </header>

    <!-- Profile card -->
    <section
      class="mb-6 flex items-center gap-4 rounded-3xl border border-[var(--color-cream-200)] bg-white p-5 shadow-sm"
    >
      <div
        class="flex size-14 items-center justify-center rounded-full bg-terracotta-100 text-xl font-semibold uppercase text-terracotta-600"
      >
        {{ displayName.charAt(0) }}
      </div>
      <div class="min-w-0">
        <p class="truncate font-semibold text-stone-800">{{ displayName }}</p>
        <p class="truncate text-sm text-stone-500">
          {{ user?.email ?? 'Not signed in' }}
        </p>
      </div>
    </section>

    <!-- Options -->
    <section class="space-y-2">
      <div
        class="flex items-center justify-between rounded-2xl border border-[var(--color-cream-200)] bg-white px-4 py-3.5"
      >
        <span class="flex items-center gap-3 text-stone-700">
          <UIcon name="i-lucide-bell" class="size-5 text-stone-400" />
          Reminders
        </span>
        <span class="text-xs text-stone-400">Coming soon</span>
      </div>
      <div
        class="flex items-center justify-between rounded-2xl border border-[var(--color-cream-200)] bg-white px-4 py-3.5"
      >
        <span class="flex items-center gap-3 text-stone-700">
          <UIcon name="i-lucide-download" class="size-5 text-stone-400" />
          Export my data
        </span>
        <span class="text-xs text-stone-400">Coming soon</span>
      </div>
    </section>

    <UButton
      class="mt-6"
      block
      color="neutral"
      variant="soft"
      icon="i-lucide-log-out"
      :loading="signingOut"
      @click="signOut"
    >
      Sign out
    </UButton>

    <p class="mt-8 text-center text-xs text-stone-400">
      Habit Tracker by Naked Compound · v0.1
    </p>
  </div>
</template>

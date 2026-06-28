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

const isEditingName = ref(false)
const newName = ref('')
const savingName = ref(false)

function startEditName() {
  newName.value = displayName.value
  isEditingName.value = true
}

async function saveName() {
  const trimmed = newName.value.trim()
  if (!trimmed) {
    toast.add({ title: 'Name cannot be empty', color: 'warning' })
    return
  }
  savingName.value = true
  const { error } = await supabase.auth.updateUser({
    data: { display_name: trimmed },
  })
  
  if (!error) {
    // Force a session refresh so the JWT gets the updated user_metadata
    await supabase.auth.refreshSession()
  }

  savingName.value = false
  
  if (error) {
    toast.add({ title: 'Failed to update name', description: error.message, color: 'error' })
    return
  }
  
  toast.add({ title: 'Profile updated', icon: 'i-lucide-check', color: 'primary' })
  isEditingName.value = false
}
const exporting = ref(false)

async function exportData() {
  exporting.value = true
  try {
    const [logsRes, journalsRes, habitsRes] = await Promise.all([
      supabase.from('habit_logs').select('*'),
      supabase.from('journal_entries').select('*'),
      supabase.from('user_habits').select('*'),
    ])
    
    if (logsRes.error) throw logsRes.error
    if (journalsRes.error) throw journalsRes.error
    if (habitsRes.error) throw habitsRes.error

    const data = {
      exported_at: new Date().toISOString(),
      user_habits: habitsRes.data,
      habit_logs: logsRes.data,
      journal_entries: journalsRes.data,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-tracker-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.add({ title: 'Export complete', icon: 'i-lucide-check', color: 'primary' })
  } catch (e: any) {
    toast.add({ title: 'Export failed', description: e.message, color: 'error' })
  } finally {
    exporting.value = false
  }
}

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
      <h1 class="text-4xl font-semibold tracking-tight text-stone-100">Settings</h1>
    </header>

    <!-- Profile card -->
    <section
      class="glass mb-6 rounded-[3rem] p-6"
    >
      <div v-if="!isEditingName" class="flex items-center justify-between">
        <div class="flex items-center gap-4 min-w-0">
          <div
            class="flex size-14 shrink-0 items-center justify-center rounded-full bg-ember-500/15 text-xl font-semibold uppercase text-ember-300"
          >
            {{ displayName.charAt(0) }}
          </div>
          <div class="min-w-0">
            <p class="truncate font-semibold text-stone-100">{{ displayName }}</p>
            <p class="truncate text-sm text-stone-400">
              {{ user?.email ?? 'Not signed in' }}
            </p>
          </div>
        </div>
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          @click="startEditName"
        />
      </div>
      
      <form v-else class="flex flex-col gap-3" @submit.prevent="saveName">
        <label class="text-sm font-medium text-stone-300">Display name</label>
        <UInput
          v-model="newName"
          auto-focus
          placeholder="Your name"
          size="lg"
          class="rounded-full [&_input]:rounded-full"
        />
        <div class="mt-2 flex gap-3">
          <UButton
            type="submit"
            color="primary"
            class="rounded-full px-5 py-2"
            :loading="savingName"
          >
            Save
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            :disabled="savingName"
            @click="isEditingName = false"
          >
            Cancel
          </UButton>
        </div>
      </form>
    </section>

    <!-- Options -->
    <section class="space-y-3">
      <div
        class="glass flex items-center justify-between rounded-full px-6 py-4"
      >
        <span class="flex items-center gap-3 text-stone-200">
          <UIcon name="i-lucide-bell" class="size-5 text-stone-400" />
          Reminders
        </span>
        <span class="text-xs text-stone-400">Coming soon</span>
      </div>
      <button
        class="glass flex w-full items-center justify-between rounded-full px-6 py-4 transition-colors hover:bg-white/8"
        :disabled="exporting"
        @click="exportData"
      >
        <span class="flex items-center gap-3 text-stone-200">
          <UIcon name="i-lucide-download" class="size-5 text-stone-400" />
          Export my data
        </span>
        <UIcon v-if="exporting" name="i-lucide-loader-2" class="size-4 animate-spin text-stone-400" />
        <UIcon v-else name="i-lucide-chevron-right" class="size-4 text-stone-500" />
      </button>
    </section>

    <UButton
      class="mt-6 rounded-full px-6 py-3.5 text-base font-medium shadow-sm bg-white/5 text-stone-100 ring-1 ring-white/10 hover:bg-white/10"
      block
      color="neutral"
      size="xl"
      variant="solid"
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

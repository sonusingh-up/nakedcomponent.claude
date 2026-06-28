<script setup lang="ts">
import type { WeekDay } from '~/types'

const props = defineProps<{ userHabitId: string }>()

const {
  fetchForHabit,
  saveReminder,
  requestPermission,
  permissionState,
} = useReminders()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const existingId = ref<string | undefined>()
const enabled = ref(false)
const time = ref('08:00')
const days = ref<WeekDay[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
const perm = ref<NotificationPermission | 'unsupported'>('default')

onMounted(async () => {
  perm.value = permissionState()
  try {
    const r = await fetchForHabit(props.userHabitId)
    if (r) {
      existingId.value = r.id
      enabled.value = r.is_enabled
      time.value = (r.remind_time || '08:00:00').slice(0, 5)
      days.value = r.remind_days?.length ? r.remind_days : days.value
    }
  } catch {
    // No reminder yet — keep defaults.
  } finally {
    loading.value = false
  }
})

function toggleDay(d: WeekDay) {
  days.value = days.value.includes(d)
    ? days.value.filter((x) => x !== d)
    : [...days.value, d]
}

async function save() {
  saving.value = true
  try {
    if (enabled.value) {
      const granted = await requestPermission()
      perm.value = permissionState()
      if (!granted) {
        toast.add({
          title: 'Notifications are off',
          description: 'Allow notifications in your browser to receive reminders.',
          color: 'warning',
        })
      }
    }
    const saved = await saveReminder({
      id: existingId.value,
      user_habit_id: props.userHabitId,
      remind_time: time.value + ':00',
      remind_days: days.value,
      is_enabled: enabled.value,
    })
    existingId.value = saved.id
    toast.add({ title: 'Reminder saved', icon: 'i-lucide-bell', color: 'primary' })
  } catch (e: any) {
    toast.add({
      title: 'Could not save reminder',
      description: e.message,
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="rounded-3xl border border-[var(--color-cream-200)] bg-white p-5">
    <div class="flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
        <UIcon name="i-lucide-bell" class="size-4" /> Reminder
      </h2>
      <USwitch v-model="enabled" color="primary" />
    </div>

    <div v-if="loading" class="mt-4">
      <USkeleton class="h-10 rounded-xl" />
    </div>

    <div v-else-if="enabled" class="mt-4 space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-sm text-stone-600">Time</label>
        <input
          v-model="time"
          type="time"
          class="rounded-xl border border-[var(--color-cream-200)] bg-[var(--color-cream-50)] px-3 py-1.5 text-sm tabular focus:border-terracotta-400 focus:outline-none"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm text-stone-600">Repeat on</label>
        <div class="flex justify-between gap-1">
          <button
            v-for="d in WEEKDAYS"
            :key="d.key"
            type="button"
            class="flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors"
            :class="
              days.includes(d.key)
                ? 'bg-terracotta-500 text-white'
                : 'bg-[var(--color-cream-100)] text-stone-500'
            "
            @click="toggleDay(d.key)"
          >
            {{ d.label }}
          </button>
        </div>
      </div>

      <p
        v-if="perm === 'denied'"
        class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700"
      >
        Notifications are blocked in your browser. Reminders are saved but won't
        show until you re-enable them in site settings.
      </p>
    </div>

    <p v-else class="mt-3 text-sm text-stone-400">
      Turn on to get a daily nudge for this habit.
    </p>

    <UButton
      v-if="!loading"
      class="mt-4"
      block
      color="primary"
      variant="soft"
      :loading="saving"
      icon="i-lucide-save"
      @click="save"
    >
      Save reminder
    </UButton>
  </section>
</template>

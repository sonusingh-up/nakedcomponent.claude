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
  <section class="glass rounded-[3rem] p-6">
    <div class="flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-400">
        <UIcon name="i-lucide-bell" class="size-4" /> REMINDER
      </h2>
      <USwitch v-model="enabled" color="primary" />
    </div>

    <div v-if="loading" class="mt-4">
      <USkeleton class="h-10 rounded-[2rem]" />
    </div>

    <div v-else-if="enabled" class="mt-5 space-y-5">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-stone-300">Time</label>
        <input
          v-model="time"
          type="time"
          class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm tabular text-stone-200 focus:border-ember-400 focus:outline-none"
        />
      </div>

      <div>
        <label class="mb-3 block text-sm font-medium text-stone-300">Repeat on</label>
        <div class="flex justify-between gap-1">
          <button
            v-for="d in WEEKDAYS"
            :key="d.key"
            type="button"
            class="flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors"
            :class="
              days.includes(d.key)
                ? 'spark-gradient text-white shadow-sm'
                : 'bg-white/5 text-stone-400'
            "
            @click="toggleDay(d.key)"
          >
            {{ d.label }}
          </button>
        </div>
      </div>

      <p
        v-if="perm === 'denied'"
        class="rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
      >
        Notifications are blocked in your browser. Reminders are saved but won't
        show until you re-enable them in site settings.
      </p>
    </div>

    <p v-else class="mt-4 text-sm text-stone-400">
      Turn on to get a daily nudge for this habit.
    </p>

    <UButton
      v-if="!loading"
      class="mt-6 rounded-full px-6 py-3 text-base font-medium shadow-none"
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

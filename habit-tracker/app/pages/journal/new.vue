<script setup lang="ts">
import type { EntryType, Mood } from '~/types'

const { create, uploadAudio } = useJournal()
const { fetchUserHabits } = useHabits()
const recorder = useAudioRecorder({ maxSeconds: 180 })
const toast = useToast()

const mode = ref<EntryType>('text')
const title = ref('')
const body = ref('')
const mood = ref<Mood | null>(null)
const habitId = ref<string>('')
const saving = ref(false)

const { data: habits } = await useAsyncData(
  'journal-habits',
  () => fetchUserHabits(),
  { server: false, default: () => [] },
)

const MOODS: { key: Mood; emoji: string }[] = [
  { key: 'great', emoji: '😄' },
  { key: 'good', emoji: '🙂' },
  { key: 'okay', emoji: '😐' },
  { key: 'bad', emoji: '😟' },
]

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const ss = String(s % 60).padStart(2, '0')
  return `${m}:${ss}`
}

async function save() {
  saving.value = true
  try {
    const common = {
      title: title.value.trim() || null,
      user_habit_id: habitId.value || null,
      mood: mood.value,
    }
    if (mode.value === 'audio') {
      if (!recorder.blob.value) {
        toast.add({ title: 'Record something first', color: 'warning' })
        return
      }
      const audio_url = await uploadAudio(recorder.blob.value)
      await create({
        ...common,
        entry_type: 'audio',
        audio_url,
        audio_duration: recorder.seconds.value,
      })
    } else {
      if (!body.value.trim() && !title.value.trim()) {
        toast.add({ title: 'Write something first', color: 'warning' })
        return
      }
      await create({ ...common, entry_type: 'text', body: body.value.trim() || null })
    }
    toast.add({ title: 'Saved', icon: 'i-lucide-check', color: 'primary' })
    await navigateTo('/journal')
  } catch (e: any) {
    toast.add({ title: 'Could not save', description: e.message, color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <button
      class="mb-3 mt-1 flex items-center gap-1 text-sm font-medium text-stone-500"
      @click="navigateTo('/journal')"
    >
      <UIcon name="i-lucide-chevron-left" class="size-5" /> Cancel
    </button>

    <h1 class="display-serif mb-4 text-3xl text-stone-900">New entry</h1>

    <!-- Mode toggle -->
    <div class="mb-4 flex gap-1 rounded-full bg-[var(--color-cream-200)] p-1">
      <button
        v-for="m in (['text', 'audio'] as EntryType[])"
        :key="m"
        class="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium capitalize transition-colors"
        :class="mode === m ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'"
        @click="mode = m"
      >
        <UIcon :name="m === 'text' ? 'i-lucide-pencil' : 'i-lucide-mic'" class="size-4" />
        {{ m }}
      </button>
    </div>

    <UInput
      v-model="title"
      placeholder="Title (optional)"
      size="lg"
      class="mb-3 w-full"
    />

    <!-- Text mode -->
    <UTextarea
      v-if="mode === 'text'"
      v-model="body"
      :rows="6"
      placeholder="How did it go today?"
      size="lg"
      class="mb-4 w-full"
    />

    <!-- Audio mode -->
    <div
      v-else
      class="mb-4 flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-cream-200)] bg-white p-6"
    >
      <p v-if="recorder.error.value" class="text-sm text-rose-600">
        {{ recorder.error.value }}
      </p>

      <template v-if="!recorder.url.value">
        <button
          class="flex size-20 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-90"
          :class="recorder.recording.value ? 'animate-pulse bg-rose-500' : 'bg-terracotta-500'"
          @click="recorder.recording.value ? recorder.stop() : recorder.start()"
        >
          <UIcon
            :name="recorder.recording.value ? 'i-lucide-square' : 'i-lucide-mic'"
            class="size-8"
          />
        </button>
        <p class="tabular text-lg font-medium text-stone-700">
          {{ fmt(recorder.seconds.value) }}
        </p>
        <p class="text-xs text-stone-400">
          {{ recorder.recording.value ? 'Tap to stop' : 'Tap to record (max 3 min)' }}
        </p>
      </template>

      <template v-else>
        <JournalAudioPlayer
          class="w-full"
          :src="recorder.url.value"
          :duration="recorder.seconds.value"
        />
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-lucide-rotate-ccw"
          @click="recorder.reset()"
        >
          Record again
        </UButton>
      </template>
    </div>

    <!-- Mood -->
    <div class="mb-4">
      <label class="mb-2 block text-sm text-stone-600">Mood (optional)</label>
      <div class="flex gap-2">
        <button
          v-for="m in MOODS"
          :key="m.key"
          class="flex size-12 items-center justify-center rounded-2xl border text-2xl transition-colors"
          :class="
            mood === m.key
              ? 'border-terracotta-400 bg-terracotta-50'
              : 'border-[var(--color-cream-200)] bg-white'
          "
          @click="mood = mood === m.key ? null : m.key"
        >
          {{ m.emoji }}
        </button>
      </div>
    </div>

    <!-- Linked habit -->
    <div class="mb-6">
      <label class="mb-2 block text-sm text-stone-600">Link to a habit (optional)</label>
      <select
        v-model="habitId"
        class="w-full rounded-xl border border-[var(--color-cream-200)] bg-white px-3 py-2.5 text-sm text-stone-700 focus:border-terracotta-400 focus:outline-none"
      >
        <option value="">None</option>
        <option v-for="h in habits" :key="h.id" :value="h.id">
          {{ h.custom_name || h.habit?.name }}
        </option>
      </select>
    </div>

    <UButton
      block
      size="xl"
      color="primary"
      :loading="saving"
      icon="i-lucide-check"
      @click="save"
    >
      Save entry
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { EntryType, Mood } from '~/types'

const { create, uploadAudio, uploadImage } = useJournal()
const { fetchUserHabits } = useHabits()
const recorder = useAudioRecorder({ maxSeconds: 180 })
const toast = useToast()

const mode = ref<EntryType>('text')
const title = ref('')
const body = ref('')
const mood = ref<Mood | null>(null)
const habitId = ref<string>('')
const saving = ref(false)

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function onImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
  }
}
function removeImage() {
  imageFile.value = null
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = null
  }
  if (fileInput.value) fileInput.value.value = ''
}

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
      
      let image_url = null
      if (imageFile.value) {
        image_url = await uploadImage(imageFile.value)
      }

      await create({
        ...common,
        entry_type: 'audio',
        audio_url,
        audio_duration: recorder.seconds.value,
        image_url
      })
    } else {
      if (!body.value.trim() && !title.value.trim() && !imageFile.value) {
        toast.add({ title: 'Write something or attach an image first', color: 'warning' })
        return
      }
      
      let image_url = null
      if (imageFile.value) {
        image_url = await uploadImage(imageFile.value)
      }

      await create({ 
        ...common, 
        entry_type: 'text', 
        body: body.value.trim() || null,
        image_url
      })
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
      class="mb-3 mt-1 flex items-center gap-1 text-sm font-medium text-stone-600 dark:text-stone-500"
      @click="navigateTo('/journal')"
    >
      <UIcon name="i-lucide-chevron-left" class="size-5" /> Cancel
    </button>

    <h1 class="mb-4 text-3xl font-semibold text-stone-900 dark:text-stone-100">New entry</h1>

    <!-- Mode toggle -->
    <div class="mb-4 flex gap-1 rounded-full bg-white/5 p-1">
      <button
        v-for="m in (['text', 'audio'] as EntryType[])"
        :key="m"
        class="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium capitalize transition-colors"
        :class="mode === m ? 'bg-stone-200 text-stone-900 shadow-sm dark:bg-white/10 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'"
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
      class="glass mb-4 flex flex-col items-center gap-3 rounded-2xl p-6"
    >
      <p v-if="recorder.error.value" class="text-sm text-rose-400">
        {{ recorder.error.value }}
      </p>

      <template v-if="!recorder.url.value">
        <button
          class="flex size-20 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-90"
          :class="recorder.recording.value ? 'animate-pulse bg-rose-500' : 'spark-gradient'"
          @click="recorder.recording.value ? recorder.stop() : recorder.start()"
        >
          <UIcon
            :name="recorder.recording.value ? 'i-lucide-square' : 'i-lucide-mic'"
            class="size-8"
          />
        </button>
        <p class="tabular text-lg font-medium text-stone-800 dark:text-stone-200">
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

    <!-- Image Attachment -->
    <div class="mb-4">
      <label class="mb-2 block text-sm text-stone-600 dark:text-stone-300">Attachment (optional)</label>

      <div v-if="imagePreview" class="relative mb-2 inline-block">
        <img :src="imagePreview" alt="Attachment preview" class="h-32 w-auto rounded-xl border border-black/10 object-cover dark:border-white/10" />
        <button
          class="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition-transform hover:scale-105"
          @click="removeImage"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>

      <div v-else>
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-image"
          class="rounded-xl border-white/10 bg-white/5 px-4 py-2 text-stone-200 hover:bg-white/10"
          @click="fileInput?.click()"
        >
          Add Photo
        </UButton>
        <input 
          ref="fileInput" 
          type="file" 
          accept="image/*" 
          class="hidden" 
          @change="onImageSelect" 
        />
      </div>
    </div>

    <!-- Mood -->
    <div class="mb-4">
      <label class="mb-2 block text-sm text-stone-600 dark:text-stone-300">Mood (optional)</label>
      <div class="flex gap-2">
        <button
          v-for="m in MOODS"
          :key="m.key"
          class="flex size-12 items-center justify-center rounded-2xl border text-2xl transition-colors"
          :class="
            mood === m.key
              ? 'border-ember-400 bg-ember-500/15'
              : 'border-stone-200 bg-stone-50 dark:border-white/10 dark:bg-white/5'
          "
          @click="mood = mood === m.key ? null : m.key"
        >
          {{ m.emoji }}
        </button>
      </div>
    </div>

    <!-- Linked habit -->
    <div class="mb-6">
      <label class="mb-2 block text-sm text-stone-600 dark:text-stone-300">Link to a habit (optional)</label>
      <select
        v-model="habitId"
        class="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-ember-400 focus:outline-none dark:border-white/10 dark:bg-[var(--color-coal-900)] dark:text-stone-200"
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

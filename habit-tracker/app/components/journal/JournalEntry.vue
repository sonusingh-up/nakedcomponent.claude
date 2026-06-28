<script setup lang="ts">
import type { JournalEntry } from '~/types'

const props = defineProps<{ entry: JournalEntry & { user_habit?: any } }>()
const emit = defineEmits<{ delete: []; update: [updates: { title?: string | null; body?: string | null }] }>()

const MOOD_EMOJI: Record<string, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😟',
}

const habitName = computed(() => {
  const uh = props.entry.user_habit
  const u = Array.isArray(uh) ? uh[0] : uh
  if (!u) return null
  const h = u.habit ? (Array.isArray(u.habit) ? u.habit[0] : u.habit) : null
  return u.custom_name || h?.name || null
})

const date = computed(() =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(props.entry.created_at),
  ),
)

// Edit state
const isEditing = ref(false)
const editTitle = ref(props.entry.title || '')
const editBody = ref(props.entry.body || '')
const saving = ref(false)

async function saveEdit() {
  saving.value = true
  try {
    emit('update', { title: editTitle.value, body: editBody.value })
    isEditing.value = false
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div
    class="relative mb-4 break-inside-avoid overflow-hidden rounded-[24px] bg-white/[0.03] p-5 shadow-lg shadow-black/20 ring-1 ring-inset ring-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] hover:ring-white/[0.1]"
  >
    <!-- Header: Date and Actions -->
    <div class="mb-3 flex items-center justify-between">
      <span class="text-[12px] font-semibold uppercase tracking-wider text-stone-500">{{ date }}</span>
      <div class="flex items-center gap-1 opacity-60 transition-opacity hover:opacity-100">
        <button
          v-if="!isEditing"
          class="flex size-7 items-center justify-center rounded-full bg-white/[0.05] text-stone-400 transition-colors hover:bg-white/[0.1] hover:text-stone-200"
          aria-label="Edit entry"
          @click="isEditing = true"
        >
          <UIcon name="i-lucide-pencil" class="size-3.5" />
        </button>
        <button
          class="flex size-7 items-center justify-center rounded-full bg-white/[0.05] text-stone-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
          aria-label="Delete entry"
          @click="emit('delete')"
        >
          <UIcon name="i-lucide-trash-2" class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-if="isEditing" class="space-y-3">
      <UInput
        v-model="editTitle"
        placeholder="Title"
        variant="none"
        class="w-full bg-white/[0.05] ring-1 ring-white/[0.1] rounded-[10px]"
      />
      <UTextarea
        v-if="entry.entry_type === 'text'"
        v-model="editBody"
        placeholder="Note body..."
        variant="none"
        autoresize
        class="w-full bg-white/[0.05] ring-1 ring-white/[0.1] rounded-[12px]"
      />
      <div class="flex justify-end gap-2 pt-2">
        <UButton color="gray" variant="ghost" size="xs" @click="isEditing = false">Cancel</UButton>
        <UButton color="primary" size="xs" :loading="saving" @click="saveEdit">Save</UButton>
      </div>
    </div>

    <!-- View Mode -->
    <template v-else>
      <h3 v-if="entry.title" class="text-[17px] font-semibold tracking-[-0.01em] text-stone-100">{{ entry.title }}</h3>

      <p
        v-if="entry.entry_type === 'text' && entry.body"
        class="mt-1.5 whitespace-pre-wrap text-[14px] leading-relaxed text-stone-300"
      >
        {{ entry.body }}
      </p>

      <JournalAudioPlayer
        v-if="entry.entry_type === 'audio' && entry.audio_url"
        class="mt-3"
        :src="entry.audio_url"
        :duration="entry.audio_duration"
      />

      <div v-if="entry.image_url" class="mt-4 overflow-hidden rounded-[16px] ring-1 ring-white/10">
        <img 
          :src="entry.image_url" 
          class="max-h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div v-if="entry.mood || habitName" class="mt-4 flex items-center gap-2">
        <span v-if="entry.mood" class="text-base drop-shadow-sm">{{ MOOD_EMOJI[entry.mood] }}</span>
        <span
          v-if="habitName"
          class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-300 ring-1 ring-white/[0.05]"
        >
          {{ habitName }}
        </span>
      </div>
    </template>
  </div>
</template>

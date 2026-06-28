<script setup lang="ts">
import type { JournalEntry } from '~/types'

const props = defineProps<{ entry: JournalEntry & { user_habit?: any } }>()
const emit = defineEmits<{ delete: [] }>()

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
</script>

<template>
  <div
    class="glass mb-3 break-inside-avoid rounded-2xl p-4"
  >
    <div class="mb-1 flex items-center justify-between">
      <span class="text-xs text-stone-400">{{ date }}</span>
      <button
        class="text-stone-500 transition-colors hover:text-rose-400"
        aria-label="Delete entry"
        @click="emit('delete')"
      >
        <UIcon name="i-lucide-trash-2" class="size-4" />
      </button>
    </div>

    <h3 v-if="entry.title" class="font-medium text-stone-100">{{ entry.title }}</h3>

    <p
      v-if="entry.entry_type === 'text' && entry.body"
      class="mt-1 whitespace-pre-wrap text-sm/relaxed text-stone-300"
    >
      {{ entry.body }}
    </p>

    <JournalAudioPlayer
      v-if="entry.entry_type === 'audio' && entry.audio_url"
      class="mt-2"
      :src="entry.audio_url"
      :duration="entry.audio_duration"
    />

    <img 
      v-if="entry.image_url" 
      :src="entry.image_url" 
      class="mt-3 max-h-64 w-full rounded-xl border border-white/10 object-cover"
      loading="lazy"
    />

    <div v-if="entry.mood || habitName" class="mt-3 flex items-center gap-2">
      <span v-if="entry.mood" class="text-base">{{ MOOD_EMOJI[entry.mood] }}</span>
      <span
        v-if="habitName"
        class="rounded-full bg-white/8 px-2 py-0.5 text-xs text-stone-300"
      >
        {{ habitName }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string; duration?: number | null }>()

const audio = ref<HTMLAudioElement>()
const playing = ref(false)
const progress = ref(0)

function toggle() {
  const a = audio.value
  if (!a) return
  playing.value ? a.pause() : a.play()
}

function onTime() {
  const a = audio.value
  if (!a || !a.duration || !isFinite(a.duration)) return
  progress.value = (a.currentTime / a.duration) * 100
}

function fmt(s?: number | null) {
  if (s == null) return ''
  const m = Math.floor(s / 60)
  const ss = String(Math.floor(s % 60)).padStart(2, '0')
  return `${m}:${ss}`
}
</script>

<template>
  <div class="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
    <button
      class="spark-gradient flex size-9 shrink-0 items-center justify-center rounded-full text-white"
      :aria-label="playing ? 'Pause' : 'Play'"
      @click="toggle"
    >
      <UIcon :name="playing ? 'i-lucide-pause' : 'i-lucide-play'" class="size-4" />
    </button>
    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
      <div class="h-full bg-ember-500 transition-[width]" :style="{ width: progress + '%' }" />
    </div>
    <span class="tabular text-xs text-stone-400">{{ fmt(duration) }}</span>
    <audio
      ref="audio"
      :src="src"
      preload="metadata"
      @timeupdate="onTime"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false"
    />
  </div>
</template>

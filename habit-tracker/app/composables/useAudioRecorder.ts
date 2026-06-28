/** MediaRecorder wrapper for short voice notes (capped duration). */
export function useAudioRecorder(opts?: { maxSeconds?: number }) {
  const max = opts?.maxSeconds ?? 180

  const recording = ref(false)
  const seconds = ref(0)
  const blob = ref<Blob | null>(null)
  const url = ref<string | null>(null)
  const error = ref<string | null>(null)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: Blob[] = []
  let stream: MediaStream | null = null
  let timer: number | null = null

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  async function start() {
    error.value = null
    reset()
    if (!import.meta.client || !navigator.mediaDevices?.getUserMedia) {
      error.value = 'Recording is not supported on this device.'
      return
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      error.value = 'Microphone access was denied.'
      return
    }
    chunks = []
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data)
    }
    mediaRecorder.onstop = () => {
      blob.value = new Blob(chunks, {
        type: mediaRecorder?.mimeType || 'audio/webm',
      })
      url.value = URL.createObjectURL(blob.value)
      stream?.getTracks().forEach((t) => t.stop())
      stream = null
    }
    mediaRecorder.start()
    recording.value = true
    seconds.value = 0
    timer = window.setInterval(() => {
      seconds.value++
      if (seconds.value >= max) stop()
    }, 1000)
  }

  function stop() {
    clearTimer()
    if (mediaRecorder && recording.value) {
      mediaRecorder.stop()
      recording.value = false
    }
  }

  function reset() {
    clearTimer()
    if (recording.value && mediaRecorder) {
      mediaRecorder.stop()
      recording.value = false
    }
    blob.value = null
    if (url.value) {
      URL.revokeObjectURL(url.value)
      url.value = null
    }
    seconds.value = 0
  }

  onBeforeUnmount(() => {
    clearTimer()
    stream?.getTracks().forEach((t) => t.stop())
    if (url.value) URL.revokeObjectURL(url.value)
  })

  return { recording, seconds, blob, url, error, start, stop, reset, max }
}

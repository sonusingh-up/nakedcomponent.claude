/**
 * Captures the browser's `beforeinstallprompt` event so we can show our own
 * "Add to Home Screen" banner at a moment of our choosing.
 */
let deferred: any = null

export default defineNuxtPlugin(() => {
  const canInstall = useState('pwa-can-install', () => false)

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e
    canInstall.value = true
  })
  window.addEventListener('appinstalled', () => {
    canInstall.value = false
    deferred = null
  })

  return {
    provide: {
      installPrompt: {
        canInstall,
        async prompt() {
          if (!deferred) return
          deferred.prompt()
          await deferred.userChoice
          deferred = null
          canInstall.value = false
        },
      },
    },
  }
})

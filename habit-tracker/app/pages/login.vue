<script setup lang="ts">
definePageMeta({ layout: 'minimal' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const sendingLink = ref(false)
const errorMsg = ref('')

// Already signed in → go home.
watchEffect(() => {
  if (user.value) navigateTo('/')
})

async function signIn() {
  errorMsg.value = ''
  loading.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
    return
  }
  await navigateTo('/')
}

async function magicLink() {
  if (!email.value) {
    errorMsg.value = 'Enter your email first.'
    return
  }
  errorMsg.value = ''
  sendingLink.value = true
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: { emailRedirectTo: `${window.location.origin}/confirm` },
  })
  sendingLink.value = false
  if (error) {
    errorMsg.value = error.message
    return
  }
  toast.add({
    title: 'Check your inbox',
    description: 'We sent you a magic sign-in link.',
    icon: 'i-lucide-mail',
  })
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center py-10">
    <div class="mb-8 text-center">
      <div
        class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-terracotta-500 text-white shadow-md"
      >
        <UIcon name="i-lucide-flame" class="size-7" />
      </div>
      <h1 class="display-serif text-3xl text-stone-900">Welcome back</h1>
      <p class="mt-1 text-sm text-stone-500">Sign in to keep your streaks going</p>
    </div>

    <form class="space-y-3" @submit.prevent="signIn">
      <UInput
        v-model="email"
        type="email"
        placeholder="you@email.com"
        icon="i-lucide-mail"
        size="lg"
        autocomplete="email"
        required
        class="w-full"
      />
      <UInput
        v-model="password"
        type="password"
        placeholder="Password"
        icon="i-lucide-lock"
        size="lg"
        autocomplete="current-password"
        required
        class="w-full"
      />

      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>

      <UButton type="submit" block color="primary" size="lg" :loading="loading">
        Sign in
      </UButton>
    </form>

    <div class="my-5 flex items-center gap-3 text-xs text-stone-400">
      <div class="h-px flex-1 bg-[var(--color-cream-200)]" />
      OR
      <div class="h-px flex-1 bg-[var(--color-cream-200)]" />
    </div>

    <UButton
      block
      color="neutral"
      variant="outline"
      size="lg"
      icon="i-lucide-sparkles"
      :loading="sendingLink"
      @click="magicLink"
    >
      Email me a magic link
    </UButton>

    <p class="mt-8 text-center text-sm text-stone-500">
      New here?
      <NuxtLink to="/signup" class="font-semibold text-terracotta-600">
        Create an account
      </NuxtLink>
    </p>
  </div>
</template>

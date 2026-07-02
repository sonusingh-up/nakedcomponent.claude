<script setup lang="ts">
definePageMeta({ layout: 'minimal' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

watchEffect(() => {
  if (user.value) navigateTo('/')
})

async function signUp() {
  errorMsg.value = ''
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }
  loading.value = true
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { display_name: name.value },
      emailRedirectTo: `${window.location.origin}/confirm`,
    },
  })
  loading.value = false
  if (error) {
    errorMsg.value = error.message
    return
  }
  // If email confirmation is required there is no active session yet.
  if (!data.session) {
    toast.add({
      title: 'Almost there',
      description: 'Check your email to confirm your account.',
      icon: 'i-lucide-mail',
    })
    return
  }
  await navigateTo('/')
}
</script>

<template>
  <div class="flex flex-1 flex-col justify-center py-10">
    <div class="mb-8 text-center">
      <div
        class="spark-gradient mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-ember-500/30"
      >
        <UIcon name="i-lucide-sprout" class="size-7" />
      </div>
      <h1 class="text-3xl font-semibold text-stone-100">Start building habits</h1>
      <p class="mt-1 text-sm text-stone-400">Create your free account</p>
    </div>

    <form class="space-y-3" @submit.prevent="signUp">
      <UInput
        v-model="name"
        placeholder="Your name"
        icon="i-lucide-user"
        size="lg"
        autocomplete="name"
        class="w-full"
      />
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
        placeholder="Password (min 6 characters)"
        icon="i-lucide-lock"
        size="lg"
        autocomplete="new-password"
        required
        class="w-full"
      />

      <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>

      <UButton type="submit" block color="primary" size="lg" :loading="loading">
        Create account
      </UButton>
    </form>

    <p class="mt-8 text-center text-sm text-stone-400">
      Already have an account?
      <NuxtLink to="/login" class="font-semibold text-ember-400">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>

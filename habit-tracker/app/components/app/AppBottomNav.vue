<script setup lang="ts">
const links = [
  { label: 'Home', to: '/', icon: 'i-lucide-house' },
  { label: 'Discover', to: '/discover', icon: 'i-lucide-compass' },
  { label: 'Journal', to: '/journal', icon: 'i-lucide-book-open' },
  { label: 'Settings', to: '/settings', icon: 'i-lucide-settings' },
]

const route = useRoute()
function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-cream-200)] bg-[var(--color-cream-50)]/90 backdrop-blur-lg"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <ul class="mx-auto flex max-w-lg items-stretch justify-around px-1">
      <li v-for="link in links" :key="link.to" class="flex-1">
        <NuxtLink
          :to="link.to"
          class="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors duration-150"
          :class="
            isActive(link.to)
              ? 'text-terracotta-600'
              : 'text-stone-500 hover:text-stone-700'
          "
        >
          <UIcon
            :name="link.icon"
            class="size-6 transition-transform"
            :class="isActive(link.to) ? 'scale-110' : ''"
          />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

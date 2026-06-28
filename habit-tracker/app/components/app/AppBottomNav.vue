<script setup lang="ts">
const links = [
  { label: 'Home', to: '/', icon: 'i-lucide-flame' },
  { label: 'Discover', to: '/discover', icon: 'i-lucide-compass' },
  { label: 'Journal', to: '/journal', icon: 'i-lucide-book-open' },
  { label: 'Settings', to: '/settings', icon: 'i-lucide-settings' },
  { label: 'Stats', to: '/stats', icon: 'i-lucide-bar-chart-2' },
]

const route = useRoute()
function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav
    class="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
    style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.9rem)"
    aria-label="Primary"
  >
    <ul
      class="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5 shadow-2xl shadow-black/10 dark:shadow-black/40"
    >
      <li v-for="link in links" :key="link.to" class="relative">
        <NuxtLink
          :to="link.to"
          :aria-label="link.label"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="flex size-12 items-center justify-center rounded-full transition-all duration-200"
          :class="
            isActive(link.to)
              ? 'bg-[#f97316] text-white shadow-lg shadow-[#f97316]/30'
              : 'text-stone-400 hover:bg-black/5 hover:text-stone-600 dark:text-[#555] dark:hover:bg-white/5 dark:hover:text-[#bbb]'
          "
        >
          <UIcon
            :name="link.icon"
            class="size-[22px] transition-transform"
            :class="isActive(link.to) ? 'scale-105' : ''"
          />
        </NuxtLink>
        <div v-if="link.label === 'Stats'" class="pointer-events-none absolute -right-1 top-0 z-10 rounded-[3px] bg-[#f97316] px-1 py-[1px] text-[9px] font-bold tracking-wide text-white">NEW</div>
      </li>
    </ul>
  </nav>
</template>

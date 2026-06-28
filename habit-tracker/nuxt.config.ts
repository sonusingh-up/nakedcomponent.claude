// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-01',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/supabase'],

  css: ['~/assets/css/main.css'],

  // Supabase auth: protect every route except the public ones below.
  // The module auto-redirects unauthenticated users to /login.
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/signup', '/confirm'],
    },
  },

  app: {
    head: {
      title: 'Habit Tracker — Naked Compound',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
        },
        {
          name: 'description',
          content:
            'Build daily habits, track streaks, set reminders and journal your progress.',
        },
        { name: 'theme-color', content: '#c96442' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'default',
        },
      ],
    },
  },
})

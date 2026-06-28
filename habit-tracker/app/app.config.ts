export default defineAppConfig({
  ui: {
    // Map Nuxt UI's semantic colors onto the Naked Compound brand palette.
    // `terracotta` is a custom color scale defined in assets/css/main.css.
    colors: {
      primary: 'terracotta',
      neutral: 'stone',
    },
    button: {
      defaultVariants: {
        // Rounded, pill-ish buttons to match the Rootinely-style UI.
        size: 'lg',
      },
    },
  },
})

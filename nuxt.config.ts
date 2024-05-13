export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxt/ui', '@nuxtjs/supabase'],
    supabase: {
        redirect: false,
    },
});

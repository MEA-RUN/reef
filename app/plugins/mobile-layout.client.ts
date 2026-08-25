import { defineNuxtPlugin } from 'nuxt/app'
import { useMobileLayout } from '~/composables/useMobileLayout'

export default defineNuxtPlugin(() => {
    const { initObserver, cleanupObserver } = useMobileLayout()

    if (import.meta.client) {
        onNuxtReady(initObserver)

        // Cleanup on app unmount
        if (import.meta.hot) {
            import.meta.hot.dispose(() => {
                cleanupObserver()
            })
        }
    }
})

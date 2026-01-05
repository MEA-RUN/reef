import { defineNuxtPlugin } from "nuxt/app";
import { useMobileLayout } from "../composables/useMobileLayout";

export default defineNuxtPlugin(() => {
    const { initObserver, cleanupObserver } = useMobileLayout();

    if (import.meta.client) {
        // Initialize on client-side mount
        const initWithRetry = () => {
            const panel = document.getElementById('splitter-group-1-panel-1');
            if (panel) {
                initObserver();
            } else {
                setTimeout(initWithRetry, 50);
            }
        };

        // Wait for layout to be mounted
        setTimeout(initWithRetry, 100);

        // Cleanup on app unmount
        if (import.meta.hot) {
            import.meta.hot.dispose(() => {
                cleanupObserver();
            });
        }
    }
});
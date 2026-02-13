import { useState } from "nuxt/app";

export const useMobileLayout = () => {
    const isMobileLayout = useState('isMobileLayout', () => {
        // Initialize with window width check
        if (import.meta.client) {
            return window.innerWidth < 1024;
        }
        return false;
    });
    const observerInitialized = useState('observerInitialized', () => false);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const checkWidth = () => {
        // Debounce to prevent rapid state changes
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            // Check window width, not panel width
            const newValue = window.innerWidth < 1024;
            // Only update if value actually changed
            if (isMobileLayout.value !== newValue) {
                isMobileLayout.value = newValue;
            }
        }, 150); // 150ms debounce
    };

    const initObserver = () => {
        if (observerInitialized.value) {
            return;
        }

        checkWidth();
        window.addEventListener('resize', checkWidth);
        observerInitialized.value = true;
    };

    const cleanupObserver = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        window.removeEventListener('resize', checkWidth);
        observerInitialized.value = false;
    };

    return {
        isMobileLayout,
        checkWidth,
        initObserver,
        cleanupObserver
    };
};
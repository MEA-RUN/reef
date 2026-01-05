import { useState } from "nuxt/app";

export const useMobileLayout = () => {
    const isMobileLayout = useState('isMobileLayout', () => {
        // Initialize with actual width check if possible
        if (import.meta.client) {
            const container = document.getElementById('splitter-group-1-panel-1');
            return container ? container.offsetWidth < 1024 : false;
        }
        return false;
    });
    const observerInitialized = useState('observerInitialized', () => false);
    let observer: ResizeObserver | null = null;

    const checkWidth = () => {
        const container = document.getElementById('splitter-group-1-panel-1');
        if (container) {
            isMobileLayout.value = container.offsetWidth < 1024;
        }
    };

    const initObserver = () => {
        if (observerInitialized.value || observer) {
            return;
        }

        const panel = document.getElementById('splitter-group-1-panel-1');
        if (!panel) {
            return;
        }

        checkWidth();
        window.addEventListener('resize', checkWidth);

        observer = new ResizeObserver(checkWidth);
        observer.observe(panel);
        observerInitialized.value = true;
    };

    const cleanupObserver = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
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
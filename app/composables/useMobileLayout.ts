import { useState } from "nuxt/app";
import { watch } from 'vue';

const LEFT_PANEL_MIN_WIDTH = 920;
let resizeObserver: ResizeObserver | null = null;

export const useMobileLayout = () => {
    const isMobileLayout = useState('isMobileLayout', () => {
        // Initialize with window width check
        if (import.meta.client) {
            return window.innerWidth < 1024;
        }
        return false;
    });
    const leftSideIsTooSmall = useState('leftSideIsTooSmall', () => false);
    const observerInitialized = useState('observerInitialized', () => false);
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const checkLeftPanelWidth = () => {
        if (!import.meta.client) {
            leftSideIsTooSmall.value = false;
            return;
        }

        const panel = document.getElementById('splitter-group-1-panel-1');
        if (!panel) {
            leftSideIsTooSmall.value = false;
            return;
        }

        const panelWidth = panel.getBoundingClientRect().width;
        leftSideIsTooSmall.value = panelWidth < LEFT_PANEL_MIN_WIDTH;
    };

    const checkWidth = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            const newValue = window.innerWidth < 1024;

            if (isMobileLayout.value !== newValue) {
                isMobileLayout.value = newValue;
            }

            checkLeftPanelWidth();
        }, 150);
    };

    const initObserver = () => {
        if (observerInitialized.value) {
            return;
        }

        checkWidth();
        window.addEventListener('resize', checkWidth);

        if (import.meta.client) {
            const panel = document.getElementById('splitter-group-1-panel-1');
            if (panel) {
                resizeObserver = new ResizeObserver(() => {
                    checkLeftPanelWidth();
                });
                resizeObserver.observe(panel);
                checkLeftPanelWidth();
            }
        }

        observerInitialized.value = true;
    };

    const cleanupObserver = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        window.removeEventListener('resize', checkWidth);
        observerInitialized.value = false;
    };

    // Close active tool and side panel when switching to mobile
    const watchIsMobileLayout = (isOpen: any, toggleSidePanel: any) => {
        watch(isMobileLayout, (newValue) => {
            console.log('Layout changed to mobile:', newValue);
            if (newValue && isOpen.value) {
                toggleSidePanel(false);
            }
        });
    }

    return {
        isMobileLayout,
        leftSideIsTooSmall,
        checkWidth,
        initObserver,
        cleanupObserver,
        watchIsMobileLayout
    };
};
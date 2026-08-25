import { useState } from 'nuxt/app'

const MOBILE_BREAKPOINT = 1024
const SPLIT_VIEW_BREAKPOINT = 1600

export const useMobileLayout = () => {
    const isMobileLayout = useState('isMobileLayout', () => false)
    const isOverlayLayout = useState('isOverlayLayout', () => true)
    const observerInitialized = useState('observerInitialized', () => false)
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    const checkWidth = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            isMobileLayout.value = window.innerWidth < MOBILE_BREAKPOINT
            isOverlayLayout.value = window.innerWidth < SPLIT_VIEW_BREAKPOINT
        }, 100)
    }

    const initObserver = () => {
        if (observerInitialized.value) {
            return
        }

        checkWidth();
        window.addEventListener('resize', checkWidth);

        observerInitialized.value = true
    }

    const cleanupObserver = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null
        }
        window.removeEventListener('resize', checkWidth)
        observerInitialized.value = false
    }

    return {
        isMobileLayout,
        isOverlayLayout,
        checkWidth,
        initObserver,
        cleanupObserver,
    }
}

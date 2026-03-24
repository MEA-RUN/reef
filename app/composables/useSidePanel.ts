import {useRuntimeConfig} from "nuxt/app";
import { watch } from 'vue';

interface ToolState {
    name: string;
    state?: Record<string, any>;
    timestamp: number;
}

export const useSidePanel = () => {
    const config = useRuntimeConfig().public

    const isOpen = useState('sidePanelOpen', () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidePanelOpen') === 'true' || !!config.sidePanel;
        }
        return !!config.sidePanel;
    });

    const isFullscreen = useState('sidePanelFullscreen', () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidePanelFullscreen') === 'true';
        }
        return false;
    });

    const lastTool = useState<ToolState | null>('sidePanelLastTool', () => {
        if (typeof window !== 'undefined' && localStorage.getItem('sidePanelLastTool')) {
            return JSON.parse(localStorage.getItem('sidePanelLastTool')!);
        }
        return null;
    });

    const toggleSidePanel = (open?: boolean) => {
        isOpen.value = open !== undefined ? open : !isOpen.value;
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidePanelOpen', String(isOpen.value));
        }
    };

    const toggleFullscreen = (fullscreen?: boolean) => {
        isFullscreen.value = fullscreen !== undefined ? fullscreen : !isFullscreen.value;
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidePanelFullscreen', String(isFullscreen.value));
        }
    };

    const setLastTool = (toolName: string, toolState?: Record<string, any>) => {
        const tool: ToolState = {
            name: toolName,
            state: toolState,
            timestamp: Date.now()
        };
        lastTool.value = tool;
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidePanelLastTool', JSON.stringify(tool));
        }
    };

    const openWithLastTool = () => {
        toggleSidePanel(true);
        return lastTool.value;
    };

    const clearLastTool = () => {
        lastTool.value = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('sidePanelLastTool');
        }
    }

    /**
     * Utility to check if the side panel is larger than a certain percentage of the viewport width.
     * @param percentage
     * @returns Return true if the side panel is larger than the specified percentage of the viewport width, false otherwise.
     */
    const isLargerThan = (percentage: number = 50) => {
        if (typeof window !== 'undefined') {
            const windowWidth = window.innerWidth;
            const panelWidth = window.innerWidth * (percentage / 100);

        }
        return false;
    }

    const watchScrollToTop = (route: any, checkWidth: any) => {
        watch(() => route.path, async () => {
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                const scrollContainer = document.querySelector('.scroll-container');
                if (scrollContainer) {
                    scrollContainer.scrollTo({ top: 0  });
                }
                setTimeout(checkWidth, 100);
            }
        }, { immediate: true });
    }

    const watchScrollToTarget = (route: any) => {
        watch(() => route.hash, (newHash) => {
            if (newHash && typeof window !== 'undefined' && typeof document !== 'undefined') {
                const target = document.getElementById(newHash.slice(1));
                const scrollContainer = document.querySelector('.scroll-container');
                if (target && scrollContainer) {
                    setTimeout(() => {
                        scrollContainer.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        }, { immediate: true });
    }

    // Exit fullscreen when closing the side panel
    const watchIsOpen = () => {
        watch(isOpen, (newValue) => {
            if (!newValue && isFullscreen.value) {
                toggleFullscreen(false);
            }
        });
    }

    return {
        isOpen,
        isFullscreen,
        lastTool,
        toggleSidePanel,
        toggleFullscreen,
        setLastTool,
        openWithLastTool,
        clearLastTool,
        watchScrollToTarget,
        watchScrollToTop,
        watchIsOpen
    };


}
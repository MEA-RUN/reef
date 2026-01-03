import {useRuntimeConfig} from "nuxt/app";

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
    };

    return {
        isOpen,
        lastTool,
        toggleSidePanel,
        setLastTool,
        openWithLastTool,
        clearLastTool
    };


}
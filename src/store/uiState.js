import { appStore, setTheme, toggleTheme, setLoading } from './appStore';

export const uiState = {
    get activeSection() { return appStore.activeSection || 'all'; },
    set activeSection(value) { appStore.activeSection = value; },

    get darkMode() { return appStore.theme === 'dark'; },
    set darkMode(value) { setTheme(value ? 'dark' : 'light'); },

    get animationEnable() { return appStore.animationEnable !== false; },
    set animationEnable(value) { appStore.animationEnable = value; },

    get loading() { return appStore.loading; },
    set loading(value) { appStore.loading = value; },

    get loadingMessage() { return appStore.loadingMessage; },
    set loadingMessage(value) { appStore.loadingMessage = value; }
};

export { setTheme, toggleTheme, setLoading };

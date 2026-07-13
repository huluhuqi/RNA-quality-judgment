import { reactive, watch } from 'vue';

export const appStore = reactive({

    theme: 'light',

    loading: false,

    loadingMessage: '正在处理...',

    sampleCount: 0,

    ignoredCount: 0,

    selectedSamples: []

});

export function setTheme(theme) {
    appStore.theme = theme;
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
}

export function toggleTheme() {
    setTheme(appStore.theme === 'light' ? 'dark' : 'light');
}

export function setLoading(loading, message = '正在处理...') {
    appStore.loading = loading;
    appStore.loadingMessage = message;
}

export function updateSampleCount(count) {
    appStore.sampleCount = count;
}

export function updateIgnoredCount(count) {
    appStore.ignoredCount = count;
}

watch(() => appStore.theme, (newTheme) => {
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    appStore.theme = savedTheme;
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

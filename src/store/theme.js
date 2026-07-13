import { defineStore } from "pinia";
import { shallowRef, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
    const mode = shallowRef("light");

    function setTheme(value) {
        mode.value = value;
    }

    function toggleTheme() {
        setTheme(mode.value === "light" ? "dark" : "light");
    }

    watch(mode, (newMode) => {
        document.documentElement.setAttribute("data-theme", newMode);
        if (newMode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, { immediate: true });

    return {
        mode,
        setTheme,
        toggleTheme
    };
}, {
    persist: {
        key: "rna-theme",
        storage: localStorage
    }
});
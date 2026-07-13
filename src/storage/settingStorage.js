import { getDB } from "./db";

export async function saveSettings(data) {
    try {
        const db = await getDB();
        await db.put("settings", {
            id: "experiment",
            data,
            time: Date.now()
        });
    } catch (e) {
        console.warn("IndexedDB保存设置失败，降级到localStorage", e);
        try {
            localStorage.setItem("rna_settings", JSON.stringify(data));
        } catch (e2) {
            console.error("localStorage保存设置失败", e2);
        }
    }
}

export async function loadSettings() {
    try {
        const db = await getDB();
        const result = await db.get("settings", "experiment");
        return result?.data || null;
    } catch (e) {
        console.warn("IndexedDB读取设置失败，降级到localStorage", e);
        try {
            const data = localStorage.getItem("rna_settings");
            return data ? JSON.parse(data) : null;
        } catch (e2) {
            console.error("localStorage读取设置失败", e2);
            return null;
        }
    }
}

export function saveTheme(theme) {
    try {
        localStorage.setItem("rna-theme", theme);
    } catch (e) {
        console.warn("保存主题失败", e);
    }
}

export function loadTheme() {
    try {
        return localStorage.getItem("rna-theme") || "blue";
    } catch (e) {
        console.warn("读取主题失败", e);
        return "blue";
    }
}
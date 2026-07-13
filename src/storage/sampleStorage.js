import { getDB } from "./db";
import { createSample } from "@/models/SampleModel";

export async function saveSamples(samples) {
    try {
        const db = await getDB();
        await db.put("samples", {
            id: "current",
            data: samples.map(item => ({
                ...item,
                analysis: null,
                result: null
            })),
            time: Date.now()
        });
    } catch (e) {
        console.warn("IndexedDB保存失败，降级到localStorage", e);
        try {
            localStorage.setItem("rna_samples", JSON.stringify(samples));
        } catch (e2) {
            console.error("localStorage也保存失败", e2);
        }
    }
}

export async function loadSamples() {
    try {
        const db = await getDB();
        const result = await db.get("samples", "current");
        return result?.data ? result.data.map(item => createSample(item)) : [];
    } catch (e) {
        console.warn("IndexedDB读取失败，降级到localStorage", e);
        try {
            const data = localStorage.getItem("rna_samples");
            return data ? JSON.parse(data).map(item => createSample(item)) : [];
        } catch (e2) {
            console.error("localStorage读取失败", e2);
            return [];
        }
    }
}

export async function clearSamplesStorage() {
    try {
        const db = await getDB();
        await db.delete("samples", "current");
    } catch (e) {
        console.warn("IndexedDB删除失败", e);
    }
    try {
        localStorage.removeItem("rna_samples");
    } catch (e) {
        console.warn("localStorage删除失败", e);
    }
}
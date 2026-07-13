import { defineStore } from "pinia";
import { shallowRef, computed } from "vue";
import { saveSamples, loadSamples, clearSamplesStorage } from "@/storage/sampleStorage";
import { createSample } from "@/models/SampleModel";
import { analyzeSample } from "@/analysis/analysisEngine";

export const useSampleStore = defineStore("sample", () => {
    const samples = shallowRef([]);
    const removingIds = shallowRef([]);
    const dirty = shallowRef(0);
    const chartVersion = shallowRef(0);
    
    let chartUpdateTimer = null;

    function refreshCharts() {
        if (chartUpdateTimer) {
            clearTimeout(chartUpdateTimer);
        }
        chartUpdateTimer = setTimeout(() => {
            chartVersion.value++;
        }, 300);
    }

    function addSample(sample) {
        const newSample = createSample({
            ...sample,
            id: crypto.randomUUID(),
            raw: {
                templateId: sample.templateId || createTemplateId(),
                concentration: sample.concentration ?? null,
                a260280: sample.a260280 ?? null,
                a260230: sample.a260230 ?? null
            },
            status: { ignored: false }
        });
        samples.value = [...samples.value, newSample];
        update();
    }

    function importSamples(list) {
        samples.value = [...samples.value, ...list.map(item => createSample(item))];
        update();
    }

    function setSamples(list) {
        samples.value = list.map(item => createSample(item));
        update();
    }

    function removeSample(id) {
        samples.value = samples.value.filter((item) => item.id !== id);
        update();
    }

    function deleteSample(id) {
        if (removingIds.value.includes(id)) return;
        removingIds.value = [...removingIds.value, id];
        setTimeout(() => {
            samples.value = samples.value.filter(item => item.id !== id);
            removingIds.value = removingIds.value.filter(rid => rid !== id);
            update();
        }, 300);
    }

    function ignoreSample(id) {
        samples.value = samples.value.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    status: { ...item.status, ignored: !item.status?.ignored }
                };
            }
            return item;
        });
        update();
    }

    function restoreSample(id) {
        samples.value = samples.value.map(item =>
            item.id === id ? { ...item, status: { ...item.status, ignored: false } } : item
        );
        update();
    }

    function updateAnalysis(id, analysis) {
        samples.value = samples.value.map(item => {
            if (item.id === id) {
                return { ...item, analysis };
            }
            return item;
        });
        update();
    }

    function analyzeAll() {
        samples.value = samples.value.map(sample => ({
            ...sample,
            analysis: analyzeSample(sample)
        }));
        update();
    }

    function clearSamples() {
        samples.value = [];
        clearSamplesStorage();
        update();
    }

    function updateSample(id, data) {
        samples.value = samples.value.map(item => {
            if (item.id === id) {
                return { ...item, ...data };
            }
            return item;
        });
        update();
    }

    const validSamples = computed(() => {
        return samples.value.filter((item) => !(item.status?.ignored || item.ignored));
    });

    async function update() {
        dirty.value++;
        await saveSamples(samples.value);
    }

    function createTemplateId() {
        const date = new Date()
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "");
        return `${date}_${String(samples.value.length + 1).padStart(3, "0")}`;
    }

    return {
        samples,
        removingIds,
        chartVersion,
        validSamples,
        dirty,
        addSample,
        importSamples,
        setSamples,
        removeSample,
        deleteSample,
        ignoreSample,
        restoreSample,
        updateAnalysis,
        analyzeAll,
        refreshCharts,
        clearSamples,
        updateSample
    };
}, {
    persist: {
        key: "rna-samples",
        storage: localStorage
    }
});
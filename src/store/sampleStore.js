import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { saveSamples, loadSamples, clearSamplesStorage } from "@/storage/sampleStorage";
import { saveSettings, loadSettings } from "@/storage/settingStorage";

export const useSampleStore = defineStore(
    "sample",
    () => {
        const samples = ref([]);

        const experimentInfo = ref({
            name: "",
            operator: "",
            date: ""
        });

        const parameters = ref({
            extractionMethod: "柱式提取",
            rtVolume: 20,
            targetAmount: 1000
        });

        const dirty = ref(0);

        const analysisResult = ref(null);

        function addSample(sample) {
            samples.value.push({
                id: Date.now(),
                templateId: sample.templateId || createTemplateId(),
                concentration: sample.concentration ?? "",
                a260280: sample.a260280 ?? "",
                a260230: sample.a260230 ?? "",
                ignored: false,
                analysis: null
            });
            update();
        }

        function importSamples(list) {
            samples.value = list.map((item, index) => ({
                ...item,
                id: item.id || Date.now() + index,
                ignored: item.ignored || false
            }));
            update();
        }

        function removeSample(id) {
            samples.value = samples.value.filter(
                (item) => item.id !== id
            );
            update();
        }

        function ignoreSample(id) {
            const item = samples.value.find((x) => x.id === id);
            if (item) {
                item.ignored = !item.ignored;
            }
            update();
        }

        function clearSamples() {
            samples.value = [];
            clearSamplesStorage();
            update();
        }

        function updateSample(id, data) {
            const item = samples.value.find((x) => x.id === id);
            if (item) {
                Object.assign(item, data);
                update();
            }
        }

        const validSamples = computed(() => {
            return samples.value.filter((item) => !item.ignored);
        });

        async function update() {
            dirty.value++;
            await saveSamples(samples.value);
            await saveSettings({
                parameters: parameters.value,
                info: experimentInfo.value
            });
        }

        async function loadState() {
            const settings = await loadSettings();
            if (settings) {
                if (settings.parameters) {
                    parameters.value = { ...parameters.value, ...settings.parameters };
                }
                if (settings.info) {
                    experimentInfo.value = { ...experimentInfo.value, ...settings.info };
                }
            }
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
            validSamples,
            analysisResult,
            experimentInfo,
            parameters,
            dirty,
            addSample,
            importSamples,
            removeSample,
            ignoreSample,
            clearSamples,
            updateSample,
            loadState
        };
    }
);
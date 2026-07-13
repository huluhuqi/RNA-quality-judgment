import { defineStore } from "pinia";
import { shallowRef } from "vue";

export const useExperimentStore = defineStore("experiment", () => {
    const extraction = shallowRef({
        method: "柱式提取",
        source: ""
    });

    const application = shallowRef({
        purpose: "qPCR",
        details: ""
    });

    const rt = shallowRef({
        volume: 20,
        targetAmount: 1000,
        maxRNA: 1000,
        minRNA: 10,
        maxVolume: 12
    });

    const experimentInfo = shallowRef({
        name: "",
        operator: "",
        date: ""
    });

    function setExtraction(data) {
        extraction.value = { ...extraction.value, ...data };
    }

    function setApplication(data) {
        application.value = { ...application.value, ...data };
    }

    function setRT(data) {
        rt.value = { ...rt.value, ...data };
    }

    function setExperimentInfo(data) {
        experimentInfo.value = { ...experimentInfo.value, ...data };
    }

    function reset() {
        extraction.value = { method: "柱式提取", source: "" };
        application.value = { purpose: "qPCR", details: "" };
        rt.value = { volume: 20, targetAmount: 1000, maxRNA: 1000, minRNA: 10, maxVolume: 12 };
        experimentInfo.value = { name: "", operator: "", date: "" };
    }

    return {
        extraction,
        application,
        rt,
        experimentInfo,
        setExtraction,
        setApplication,
        setRT,
        setExperimentInfo,
        reset
    };
}, {
    persist: true
});
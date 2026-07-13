export function createExperiment(data = {}) {
    return {
        extraction: {
            method: data.extraction?.method || "column",
            kit: data.extraction?.kit || "",
            source: data.extraction?.source || ""
        },
        application: {
            purpose: data.application?.purpose || "qpcr",
            sensitivity: data.application?.sensitivity || "normal"
        },
        rt: {
            enzyme: data.rt?.enzyme || "",
            systemVolume: data.rt?.systemVolume || 20
        }
    };
}
import { createRTResult } from "./rtModel";

export function normalizeSample(data) {
    return {
        id: data.id || crypto.randomUUID(),
        raw: {
            templateId: data.raw?.templateId || data.templateId || "",
            concentration: data.raw?.concentration ?? data.concentration ?? null,
            a260280: data.raw?.a260280 ?? data.a260280 ?? null,
            a260230: data.raw?.a260230 ?? data.a260230 ?? null
        },
        status: {
            ignored: false
        },
        analysis: null,
        rt: createRTResult()
    };
}

export function createSample(data = {}) {
    return {
        id: data.id || crypto.randomUUID(),
        raw: {
            templateId: data.raw?.templateId || data.templateId || "",
            concentration: data.raw?.concentration ?? data.concentration ?? null,
            a260280: data.raw?.a260280 ?? data.a260280 ?? null,
            a260230: data.raw?.a260230 ?? data.a260230 ?? null
        },
        experiment: {
            extraction: {
                method: data.experiment?.extraction?.method || data.experiment?.extractMethod || "column",
                kit: data.experiment?.extraction?.kit || "",
                source: data.experiment?.extraction?.source || ""
            },
            application: {
                purpose: data.experiment?.application?.purpose || data.experiment?.purpose || "qpcr",
                sensitivity: data.experiment?.application?.sensitivity || "normal"
            },
            rt: {
                enzyme: data.experiment?.rt?.enzyme || "",
                systemVolume: data.experiment?.rt?.systemVolume || 20
            }
        },
        analysis: {
            quality: data.analysis?.quality || null,
            pollution: data.analysis?.pollution || null,
            advice: data.analysis?.advice || null
        },
        rt: {
            targetRNA: data.rt?.targetRNA || null,
            templateVolume: data.rt?.templateVolume || null,
            maxTemplateVolume: data.rt?.maxTemplateVolume || 12,
            waterVolume: data.rt?.waterVolume || null,
            statusCode: data.rt?.statusCode || "",
            statusText: data.rt?.statusText || "",
            suggestion: data.rt?.suggestion || "",
            requiredConcentration: data.rt?.requiredConcentration || null
        },
        status: {
            ignored: data.status?.ignored || data.ignored || false,
            deleted: false
        }
    };
}

export function isSampleIgnored(sample) {
    return sample.status?.ignored === true;
}

export function getSampleTemplateId(sample) {
    return sample.raw?.templateId || sample.templateId || "";
}

export function getSampleConcentration(sample) {
    return sample.raw?.concentration ?? sample.concentration ?? null;
}

export function getSampleA260280(sample) {
    return sample.raw?.a260280 ?? sample.a260280 ?? null;
}

export function getSampleA260230(sample) {
    return sample.raw?.a260230 ?? sample.a260230 ?? null;
}
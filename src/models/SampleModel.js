import { createRTResult } from "./rtModel";

/**
 * 标准化样本数据
 * 兼容旧格式，统一输出到新格式
 */
export function normalizeSample(data) {
    const rtData = data.rtConfig || data.rt || createRTResult();
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
        rtConfig: rtData
    };
}

/**
 * 创建标准样本对象
 * 字段命名：2026-07 最终冻结版
 */
export function createSample(data = {}) {
    const rtData = data.rtConfig || data.rt || createRTResult();
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
        rtConfig: {
            targetRNA: rtData.targetRNA || null,
            templateVolume: rtData.templateVolume !== undefined ? rtData.templateVolume : null,
            maxTemplateVolume: rtData.maxTemplateVolume || 12,
            waterVolume: rtData.waterVolume !== undefined ? rtData.waterVolume : null,
            statusCode: rtData.statusCode || "",
            statusText: rtData.statusText || "",
            suggestion: rtData.suggestion || "",
            requiredConcentration: rtData.requiredConcentration !== undefined ? rtData.requiredConcentration : null
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

/**
 * 获取 RT 配置（兼容旧字段 rt）
 */
export function getSampleRTConfig(sample) {
    return sample?.rtConfig || sample?.rt || createRTResult();
}

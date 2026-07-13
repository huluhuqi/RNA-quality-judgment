/**
 * RNA样本标准数据模型（最终冻结版）
 *
 * 所有模块必须遵守此结构，禁止新增散列字段。
 * 任何新数据必须挂载到对应命名空间下。
 */

export function createRNASample(data = {}) {
    return {
        // ===== 基础信息 =====
        id: data.id || crypto.randomUUID(),
        templateId: data.templateId || data.raw?.templateId || "",
        createdAt: data.createdAt || Date.now(),

        // ===== 原始检测数据 =====
        concentration: data.concentration != null ? Number(data.concentration) : null,
        a260_280: data.a260_280 != null ? Number(data.a260_280) : null,
        a260_230: data.a260_230 != null ? Number(data.a260_230) : null,

        // 兼容旧结构 raw
        raw: data.raw || {
            templateId: data.templateId || "",
            concentration: data.concentration ?? null,
            a260280: data.a260_280 ?? null,
            a260230: data.a260_230 ?? null
        },

        // ===== 状态 =====
        status: {
            ignored: data.status?.ignored || data.ignored || false,
            deleted: data.status?.deleted || false
        },

        // ===== RNA质量分析结果 =====
        quality: data.quality || {
            score: null,
            level: null,
            reason: "",
            issues: []
        },

        // ===== 污染分析 =====
        contamination: data.contamination || {
            types: [],
            messages: [],
            severity: null,
            description: ""
        },

        // ===== 提取建议 =====
        extractionAdvice: data.extractionAdvice || [],

        // ===== RT配置 =====
        rtConfig: data.rtConfig || data.rt || {
            targetRNA: null,
            templateVolume: null,
            waterVolume: null,
            maxTemplateVolume: 12,
            statusCode: "",
            statusText: "",
            suggestion: "",
            requiredConcentration: null,
            calculatedAt: null
        },

        // ===== 实验配置（可选） =====
        experiment: data.experiment || null
    };
}

/**
 * 批量创建样本
 */
export function createRNASamples(list = []) {
    return list.map(item => createRNASample(item));
}

/**
 * 验证样本结构（开发期使用）
 * 结构异常时在控制台打印警告
 *
 * @returns {boolean} 是否通过
 */
export function validateRNASample(sample) {
    if (!sample) {
        console.error("[RNASample] 样本为空:", sample);
        return false;
    }

    const required = [
        "id",
        "templateId",
        "concentration",
        "a260_280",
        "a260_230",
        "status",
        "quality",
        "contamination",
        "extractionAdvice",
        "rtConfig"
    ];

    const missing = required.filter(k => !(k in sample));

    if (missing.length > 0) {
        console.error("[RNASample] 缺少必填字段:", missing, sample);
        return false;
    }

    // 检查嵌套结构
    if (!sample.status || typeof sample.status !== "object") {
        console.error("[RNASample] status 结构异常:", sample.status);
        return false;
    }

    if (!sample.rtConfig || typeof sample.rtConfig !== "object") {
        console.error("[RNASample] rtConfig 结构异常:", sample.rtConfig);
        return false;
    }

    if (!sample.quality || typeof sample.quality !== "object") {
        console.error("[RNASample] quality 结构异常:", sample.quality);
        return false;
    }

    if (!sample.contamination || typeof sample.contamination !== "object") {
        console.error("[RNASample] contamination 结构异常:", sample.contamination);
        return false;
    }

    return true;
}

/**
 * 批量验证
 */
export function validateRNASamples(samples = []) {
    let allValid = true;
    samples.forEach((sample, i) => {
        if (!validateRNASample(sample)) {
            console.error(`[RNASample] 第 ${i} 个样本结构异常`);
            allValid = false;
        }
    });
    return allValid;
}

export default createRNASample;

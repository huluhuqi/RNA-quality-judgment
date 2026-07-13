/**
 * RT结果数据模型
 *
 * 所有样本的RT数据必须通过 createRTResult 初始化，
 * 保证结构统一，字段完整。
 *
 * 唯一计算入口：src/services/rtService.js → calculateSampleRT()
 * 唯一写入入口：App.vue refreshAnalysis() + sampleStore analyzeAll()
 */

export function createRTResult() {
    return {
        targetRNA: null,
        concentration: null,
        templateVolume: null,
        waterVolume: null,
        maxTemplateVolume: 12,
        statusCode: "",
        statusText: "",
        suggestion: "",
        requiredConcentration: null,
        calculatedAt: null
    };
}

/**
 * 规范化RT结果 - 确保所有字段存在
 * @param {Object} rtData
 * @returns {Object} 完整的RT结果对象
 */
export function normalizeRTResult(rtData = {}) {
    const base = createRTResult();
    return {
        ...base,
        ...rtData
    };
}

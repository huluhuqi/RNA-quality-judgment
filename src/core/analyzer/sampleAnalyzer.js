/**
 * 统一样本分析入口
 *
 * RNA 质量分析只执行一次，结果写入 sample.result，
 * 所有组件（表格/总结/Excel/PDF）统一读取，避免重复计算。
 *
 * result 结构：
 * {
 *   quality, pollution, pollutionText, suggestion, pollutionType, diagnosis,
 *   status: { rtRecommend, qualityAnalysis, fullPollutionAnalysis, only280Analysis },
 *   advice: {
 *     pollution:    [{ type, level, text }],
 *     extraction:   [{ type, level, title, cause, step, solution }],
 *     concentration:[{ type, level, text, suggestion }]
 *   }
 * }
 * 
 * 性能优化：
 * - 使用缓存避免重复分析同一样本
 * - 支持批量分析时分片处理
 */
import { analyzeRNA } from "../quality"
import { generateAdvice } from "../advice"
import { getAnalysisStatus } from "../analyze/analysisStatus"
import { 
    getAnalysisCache, 
    setAnalysisCache, 
    hasAnalysisCache,
    clearAnalysisCache
} from "../cache/sampleAnalysisCache"
import { handleError } from "../error/errorHandler"
import { ErrorType } from "../error/errorType"


/**
 * 单个样本分析（带缓存）
 *
 * @param {Object} sample  标准化样本
 * @param {Object} config  { method, application, ...rtConfig }
 * @param {boolean} useCache 是否使用缓存（默认true）
 * @returns {Object} 带有 result 字段的样本
 */
export function analyzeSample(sample, config = {}, useCache = true){

    if(sample.ignored){
        return {
            ...sample,
            result: null
        };
    }

    const sampleId = sample.id || sample.templateId;
    if (useCache && sampleId && hasAnalysisCache(sampleId)) {
        const cachedResult = getAnalysisCache(sampleId);
        return {
            ...sample,
            result: cachedResult
        };
    }

    const qualityResult = analyzeRNA(
        sample,
        config.method,
        config.application
    )

    const advice = generateAdvice(
        sample,
        config.method,
        config
    )

    const result = {
        ...qualityResult,
        status: getAnalysisStatus(sample),
        advice
    };

    if (sampleId) {
        setAnalysisCache(sampleId, result);
    }

    return {
        ...sample,
        result
    };

}

export function safeAnalyzeSample(sample, config = {}) {
    try {
        return analyzeSample(sample, config);
    } catch (e) {
        handleError(e, ErrorType.ANALYSIS, `样本 ${sample.id || sample.templateId} 分析失败`);
        return {
            ...sample,
            result: {
                quality: "无法判断",
                pollution: "数据异常",
                suggestion: "请检查输入数据",
                status: { rtRecommend: false, qualityAnalysis: false },
                advice: { pollution: [], extraction: [], concentration: [] }
            }
        };
    }
}


/**
 * 批量分析（带缓存）
 * 
 * @param {Array} samples
 * @param {Object} config  { method, application }
 * @returns {Array} 每个样本带有 result 字段
 */
export function analyzeSamples(samples = [], config = {}){

    return samples.map(sample =>
        safeAnalyzeSample(sample, config)
    );


}


/**
 * 重新分析单个样本（清除缓存后重新分析）
 * 
 * @param {Object} sample 样本
 * @param {Object} config 配置
 * @returns {Object} 带有新 result 字段的样本
 */
export function reanalyzeSample(sample, config = {}) {
    const sampleId = sample.id || sample.templateId;
    if (sampleId) {
        clearAnalysisCache(sampleId);
    }
    return analyzeSample(sample, config, false);
}


/**
 * 批量重新分析（清除所有缓存后重新分析）
 * 
 * @param {Array} samples 样本数组
 * @param {Object} config 配置
 * @returns {Array} 带有新 result 字段的样本数组
 */
export function reanalyzeAll(samples = [], config = {}) {
    // 清除所有缓存
    samples.forEach(sample => {
        const sampleId = sample.id || sample.templateId;
        if (sampleId) {
            clearAnalysisCache(sampleId);
        }
    });
    
    // 重新分析
    return analyzeSamples(samples, config);
}


/**
 * 批量分析（异步分块版本）
 * 
 * 适用于大数据量场景（1000+样本）
 * 分块处理避免阻塞主线程
 * 
 * @param {Array} samples 样本数组
 * @param {Object} config 配置
 * @param {Function} onProgress 进度回调 (processed, total) => void
 * @param {number} chunkSize 每块大小（默认200）
 * @returns {Promise<Array>}
 */
export async function analyzeSamplesAsync(samples = [], config = {}, onProgress = null, chunkSize = 200) {
    const results = [];
    const total = samples.length;
    
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = samples.slice(i, i + chunkSize);
        const chunkResults = chunk.map(sample => analyzeSample(sample, config));
        results.push(...chunkResults);
        
        if (onProgress) {
            onProgress(Math.min(i + chunkSize, total), total);
        }
        
        // 让出主线程
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
}

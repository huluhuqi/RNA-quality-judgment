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
import { getContaminationDisplay } from "../../config/contaminationMapping"

export function analyzeSample(sample, config = {}, useCache = true){
    const sampleId = sample.id || sample.raw?.templateId || sample.templateId;
    if (useCache && sampleId && hasAnalysisCache(sampleId)) {
        const cachedResult = getAnalysisCache(sampleId);
        return {
            ...sample,
            analysis: {
                quality: { level: cachedResult.quality, score: cachedResult.qualityScore, reason: cachedResult.diagnosis },
                pollution: { types: [], description: cachedResult.pollution },
                advice: { extraction: [], experiment: cachedResult.suggestion }
            },
            result: cachedResult
        };
    }

    const qualityResult = analyzeRNA(
        sample.raw || sample,
        config.method,
        config.application
    )

    const advice = generateAdvice(
        sample.raw || sample,
        config.method,
        config
    )

    const result = {
        ...qualityResult,
        status: getAnalysisStatus(sample.raw || sample),
        advice
    };

    const analysis = {
        quality: {
            level: qualityResult.quality,
            score: qualityResult.qualityScore,
            reason: qualityResult.diagnosis || ""
        },
        pollution: {
            types: (advice.pollution || []).map(p => getContaminationDisplay(p.type)),
            description: formatPollutionText(advice.pollution)
        },
        advice: {
            extraction: formatExtractionAdvice(advice.extraction),
            experiment: qualityResult.suggestion || ""
        }
    };

    if (sampleId) {
        setAnalysisCache(sampleId, result);
    }

    return {
        ...sample,
        analysis,
        result
    };

}

/**
 * 格式化污染描述文本
 *
 * judgePollution 返回 { type, level, text }，
 * text 已是完整中文描述，直接使用。
 */
function formatPollutionText(pollution = []) {
    if (!pollution || pollution.length === 0) return "未发现明显污染指标异常";
    return pollution.map(item => item.text || `${getContaminationDisplay(item.type)}: 检测到污染风险`).join("\n");
}

/**
 * 格式化提取建议为结构化数组
 *
 * generateAdvice 返回的 extraction 数组项含 { type, level, title, cause, step, solution, source }
 * UI 模板需要 { type, problem, steps }
 *
 * @returns {Array} [{ type: string, problem: string, steps: string[] }]
 */
function formatExtractionAdvice(extraction = []) {
    if (!extraction || extraction.length === 0) return [];

    return extraction.map(item => ({
        type: item.type || "",
        problem: item.title || getContaminationDisplay(item.type) || "提取流程建议",
        steps: Array.isArray(item.solution) && item.solution.length > 0
            ? item.solution
            : Array.isArray(item.step) && item.step.length > 0
                ? item.step
                : ["当前污染类型暂无标准提取流程建议"]
    }));
}

export function safeAnalyzeSample(sample, config = {}) {
    try {
        return analyzeSample(sample, config);
    } catch (e) {
        handleError(e, ErrorType.ANALYSIS, `样本 ${sample.id || sample.raw?.templateId || sample.templateId} 分析失败`);
        return {
            ...sample,
            analysis: {
                quality: { level: "无法判断", score: null, reason: "数据异常" },
                pollution: { types: [], description: "数据异常" },
                advice: { extraction: [], experiment: "请检查输入数据" }
            },
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

export function analyzeSamples(samples = [], config = {}){
    return samples.map(sample =>
        safeAnalyzeSample(sample, config)
    );
}

export function reanalyzeSample(sample, config = {}) {
    const sampleId = sample.id || sample.raw?.templateId || sample.templateId;
    if (sampleId) {
        clearAnalysisCache(sampleId);
    }
    return analyzeSample(sample, config, false);
}

export function reanalyzeAll(samples = [], config = {}) {
    samples.forEach(sample => {
        const sampleId = sample.id || sample.raw?.templateId || sample.templateId;
        if (sampleId) {
            clearAnalysisCache(sampleId);
        }
    });

    return analyzeSamples(samples, config);
}

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

        await new Promise(resolve => setTimeout(resolve, 0));
    }

    return results;
}

/**
 * 实验批次总结分析
 *
 * 基于单样本分析结果，生成批次级统计和实验结论。
 * 数据来源：sample.result（由 sampleAnalyzer 预先计算）
 * 
 * 性能优化：使用脏检查避免重复计算
 */
import { QUALITY_LEVEL, PENDING, getQualityLabel } from "../../config/qualityLevel";
import { getValidSamples } from "../sample/sampleUtils";

// 缓存
let cachedSummary = null;
let lastSampleIds = [];

/**
 * 生成实验批次总结（带缓存）
 *
 * @param {Array} samples 样本数组（已包含 result 分析结果）
 * @returns {Object} 批次总结对象
 */
export function generateBatchSummary(samples = []) {
    
    // 检查是否需要重新计算
    const currentIds = samples.map(s => s.id).join(',');
    if (cachedSummary && lastSampleIds === currentIds) {
        return cachedSummary;
    }

    const validSamples = getValidSamples(samples);

    const summary = {

        total: validSamples.length,

        quality: analyzeQuality(validSamples),

        pollution: analyzePollution(validSamples),

        extraction: analyzeExtraction(validSamples),

        rt: analyzeRT(validSamples),

        conclusion: ""

    };

    summary.conclusion = generateConclusion(summary);

    // 更新缓存
    cachedSummary = summary;
    lastSampleIds = currentIds;

    return summary;

}

/**
 * 清除批次总结缓存
 */
export function clearBatchSummaryCache() {
    cachedSummary = null;
    lastSampleIds = [];
}


/**
 * RNA质量统计
 *
 * 基于新评分系统（0-100分）进行统计：
 *   - excellent: score >= 90
 *   - good:      score >= 75
 *   - warning:   score >= 60
 *   - poor:      score >= 40
 *   - fail:      score < 40
 */
function analyzeQuality(samples) {

    const result = {
        excellent: 0,
        good: 0,
        warning: 0,
        poor: 0,
        fail: 0,
        unknown: 0,
        avgScore: 0,
        totalScore: 0
    };

    samples.forEach(sample => {

        const quality = sample.result?.quality;
        const score = sample.result?.qualityScore;

        if (score !== null && score !== undefined) {
            result.totalScore += score;
        }

        switch (quality) {

            case QUALITY_LEVEL.EXCELLENT.value:
                result.excellent++;
                break;

            case QUALITY_LEVEL.GOOD.value:
                result.good++;
                break;

            case QUALITY_LEVEL.WARNING.value:
                result.warning++;
                break;

            case QUALITY_LEVEL.POOR.value:
                result.poor++;
                break;

            case QUALITY_LEVEL.FAIL.value:
                result.fail++;
                break;

            case PENDING.value:
                result.unknown++;
                break;

            default:
                result.unknown++;

        }

    });

    const scoredCount = samples.length - result.unknown;
    result.avgScore = scoredCount > 0 ? Math.round(result.totalScore / scoredCount) : null;

    return result;

}


/**
 * 污染统计
 */
function analyzePollution(samples) {

    const result = {};

    samples.forEach(sample => {

        const pollution = sample.result?.advice?.pollution || [];

        pollution.forEach(item => {

            const type = item.type || "未知污染";

            if (!result[type]) {
                result[type] = 0;
            }

            result[type]++;

        });

    });

    return result;

}


/**
 * 提取问题统计
 */
function analyzeExtraction(samples) {

    const result = {};

    samples.forEach(sample => {

        const problems = sample.result?.advice?.extractionProblem || [];

        problems.forEach(item => {

            const key = item.problem || "未知问题";

            if (!result[key]) {
                result[key] = 0;
            }

            result[key]++;

        });

    });

    return result;

}


/**
 * RT分析
 */
function analyzeRT(samples) {

    let recommend = 0;
    let cannot = 0;

    samples.forEach(sample => {

        if (sample.result?.status?.rtRecommend) {
            recommend++;
        } else {
            cannot++;
        }

    });

    return {
        recommend,
        cannot
    };

}


/**
 * 自动生成实验结论
 */
function generateConclusion(summary) {

    const total = summary.total;

    if (total === 0) {
        return "暂无有效实验数据，请导入样本后重新分析。";
    }

    const poor = summary.quality.poor + summary.quality.fail;
    const poorRate = poor / total;

    let conclusion = "";

    if (poorRate < 0.1) {

        conclusion = `本批次RNA整体质量良好，${total}个有效样本中大部分RNA纯度符合后续实验要求。建议直接进入下游实验。`;

    } else if (poorRate < 0.3) {

        conclusion = `本批次RNA整体质量一般，${poor}个样本（占比${(poorRate * 100).toFixed(1)}%）存在纯度异常。建议针对异常样本检查提取过程，必要时进行RNA纯化后重新检测。`;

    } else {

        conclusion = `本批次存在较多RNA质量异常样本（${poor}个，占比${(poorRate * 100).toFixed(1)}%）。建议重点检查RNA提取流程，包括裂解、纯化、洗涤及残留去除步骤。`;

    }

    const hasMissing230 = summary.pollution["未检测A260/230"];
    if (hasMissing230 && hasMissing230 > total * 0.3) {

        conclusion += `\n\n注意：${hasMissing230}个样本未检测A260/230，当前污染分析主要依据A260/280。如用于高敏感实验，建议补充A260/230检测。`;

    }

    return conclusion;

}

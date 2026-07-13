/**
 * 实验报告统一数据模型
 *
 * 所有导出（Excel/PDF）共享同一数据模型，保证一致性
 * 
 * 结构：
 * {
 *   experimentInfo: { name, date, operator },
 *   parameters: { extractionMethod, rt },
 *   samples: [{ templateId, concentration, a260280, a260230, quality, pollution, advice }],
 *   summary: { conclusion, qualityCount, pollutionCount, ... },
 *   charts: { quality, pollution }
 * }
 */
import { getValidSamples } from "../sample/sampleUtils";
import { getQualityLabel } from "../../config/qualityLevel";
import {
    formatPollutionText,
    formatExtractionProblemText,
    formatExtractionSuggestionText
} from "./formatReportData";

/**
 * 创建统一报告数据模型
 * 
 * @param {Object} data 实验数据
 * @param {Array} data.samples 样本数组
 * @param {Object} data.summary 批次总结
 * @param {Object} data.settings 实验设置
 * @param {Object} data.charts 图表配置
 * @returns {Object} 报告数据模型
 */
export function createReportModel(data) {
    const { samples = [], summary = {}, settings = {}, charts = {} } = data;
    
    return {
        // 实验信息
        experimentInfo: {
            name: settings.name || summary.name || "",
            date: settings.date || summary.date || "",
            operator: settings.operator || summary.operator || "",
            extractionMethod: settings.method || summary.extractionMethod || ""
        },
        
        // 参数配置
        parameters: {
            extractionMethod: settings.method || summary.extractionMethod || "",
            rt: settings.rt || summary.rt || {}
        },
        
        // 样本数据（仅有效样本）
        samples: getValidSamples(samples).map(sample => {
            const result = sample.result || {};
            const advice = result.advice || {};
            
            return {
                templateId: sample.id || sample.templateId || "",
                concentration: sample.concentration ?? "",
                a260280: sample.a260280 ?? "",
                a260230: sample.a260230 ?? "",
                quality: result.quality ? getQualityLabel(result.quality) : "未判断",
                pollution: formatPollutionText(advice.pollution),
                extractionProblem: formatExtractionProblemText(advice.extractionProblem),
                suggestion: formatExtractionSuggestionText(advice.extractionProblem),
                qualityScore: result.qualityScore ?? "",
                diagnosis: result.diagnosis ?? ""
            };
        }),
        
        // 批次总结
        summary: {
            total: summary.totalCount || summary.total || 0,
            valid: summary.validCount || 0,
            ignored: summary.ignoredCount || 0,
            conclusion: summary.conclusion || "",
            avgConcentration: summary.avgConcentration || 0,
            quality: summary.quality ? getQualityLabel(summary.quality) : "待检测",
            qualityCount: summary.qualityCount || {},
            pollutionCount: summary.pollutionCount || {},
            extractionCount: summary.extractionCount || {},
            pollutionSamples: summary.pollutionSamples || [],
            extractionSummaryText: summary.extractionSummaryText || ""
        },
        
        // 图表数据
        charts: {
            quality: charts.quality || null,
            pollution: charts.pollution || null,
            extraction: charts.extraction || null
        }
    };
}

/**
 * 格式化污染信息
 * 
 * @param {Array} pollution 污染数组
 * @returns {string} 格式化后的文本
 */
export function formatPollution(pollution = []) {
    return pollution.map(item => `${item.type}: ${item.reason}`).join("\n");
}

/**
 * 格式化建议信息
 * 
 * @param {Array} advice 建议数组
 * @returns {string} 格式化后的文本
 */
export function formatAdvice(advice = []) {
    if (Array.isArray(advice)) {
        return advice.join("\n");
    }
    return "";
}

/**
 * 获取异常样本列表（质量较差或不合格）
 * 
 * @param {Array} samples 样本数组
 * @returns {Array} 异常样本列表
 */
export function getAbnormalSamples(samples) {
    return samples.filter(sample => {
        const quality = sample.result?.quality;
        return quality === 'poor' || quality === 'fail';
    });
}
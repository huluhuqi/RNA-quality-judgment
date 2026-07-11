/**
 * 批量统计统一入口
 *
 * 返回结构与原 BatchStatistics.js 完全一致：
 *   totalCount, validCount, ignoredCount, pendingCount,
 *   avgConcentration, minConcentration, maxConcentration,
 *   quality, qualityCount,
 *   pollution, pollutionSamples, pollutionCount,
 *   applicationSummary
 *
 * RT 相关字段（rt, rtWarning）由 App.vue 外部追加，此处不处理。
 */
import { getSampleStatistics } from "./sampleStatistics";
import { getPollutionStatistics } from "./pollutionStatistics";
import { buildSummary } from "./summaryBuilder";
import { getExtractionStatistics, toExtractionChartData } from "./extractionStatistics";


export function calculateBatch(samples, extractionMethod, application){


    // 样本质量统计 + 浓度统计
    const sampleStat = getSampleStatistics(samples, extractionMethod, application);


    // 污染统计
    const pollutionStat = getPollutionStatistics(sampleStat.analysisResults);


    // 顶部总结
    const summary = buildSummary(sampleStat, application);


    // 组装最终结果（与原结构一致）
    return {
        totalCount: sampleStat.totalCount,
        validCount: sampleStat.validCount,
        ignoredCount: sampleStat.ignoredCount,
        pendingCount: sampleStat.pendingCount,

        avgConcentration: sampleStat.avgConcentration,
        minConcentration: sampleStat.minConcentration,
        maxConcentration: sampleStat.maxConcentration,

        quality: summary.quality,
        qualityCount: sampleStat.qualityCount,

        pollution: pollutionStat.pollutionSummary,
        pollutionSamples: pollutionStat.pollutionSamples,
        pollutionCount: pollutionStat.pollutionCount,

        applicationSummary: summary.applicationSummary,

        extractionCount: getExtractionStatistics(samples),
        extractionChartData: toExtractionChartData(getExtractionStatistics(samples))
    };


}

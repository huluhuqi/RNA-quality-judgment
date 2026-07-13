/**
 * 统计上下文
 *
 * 统一所有统计模块的数据入口：
 *   所有统计分析只基于有效样本（activeSamples），
 *   被忽略的样本不参与任何分析、统计、图表、导出、RT计算。
 *
 * 使用方式：
 *   const ctx = createStatisticsContext(samples)
 *   ctx.totalSamples     // 全部样本数
 *   ctx.ignoredCount    // 忽略样本数
 *   ctx.activeCount      // 有效样本数
 *   ctx.activeSamples    // 有效样本数组
 */
import { getActiveSamples, getIgnoredCount } from "@/utils/sampleFilter";

export function createStatisticsContext(samples = []) {
    const activeSamples = getActiveSamples(samples);

    return {
        totalSamples: samples.length,
        ignoredCount: getIgnoredCount(samples),
        activeSamples,
        activeCount: activeSamples.length
    };
}

/**
 * 导出数据统一格式
 *
 * 不进行任何重新计算，只读取分析结果。
 * 统一读取 sample.result，保证 Excel / PDF / 页面三者一致。
 */


/**
 * 格式化样本数据用于导出
 *
 * @param {Array} samples 页面样本数组
 * @returns {Array} 导出用样本数组（仅包含有效样本）
 */
export function formatSamples(samples = []){


    return samples

        .filter(item => !item.ignored)

        .map(item => ({

            id: item.id || "",
            concentration: item.concentration ?? "",
            a260280: item.a260280 ?? "",
            a260230: item.a260230 ?? "",
            quality: item.result?.quality || "无法判断",
            pollution: item.result?.pollution || "",
            suggestion: item.result?.suggestion || ""

        }));

}


/**
 * 格式化总结数据用于导出
 *
 * summary 已是结构化对象，此处仅做字段补全与透传，
 * 保留 createSummarySheet 所需的全部字段。
 *
 * @param {Object} summary 批量统计结果
 * @returns {Object} 导出用总结对象
 */
export function formatSummary(summary = {}){


    return {
        ...summary,
        totalCount: summary.totalCount || 0,
        validCount: summary.validCount || 0,
        ignoredCount: summary.ignoredCount || 0,
        avgConcentration: summary.avgConcentration || 0,
        quality: summary.quality || "待检测",
        qualityCount: summary.qualityCount || {},
        pollution: summary.pollution || "暂无数据",
        pollutionCount: summary.pollutionCount || {},
        pollutionSamples: summary.pollutionSamples || [],
        rt: summary.rt || {}
    };

}

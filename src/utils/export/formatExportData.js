/**
 * 导出数据统一格式
 *
 * 不进行任何重新计算，只读取分析结果。
 * 统一读取 sample.result，保证 Excel / PDF / 页面三者一致。
 *
 * 第9.11.3步：新增提取方法、污染详情、提取过程问题分析字段。
 */


/**
 * 格式化样本数据用于导出
 *
 * @param {Array} samples 页面样本数组
 * @param {string} extractionMethod 当前提取方法（来自 RT 参数配置）
 * @returns {Array} 导出用样本数组（仅包含有效样本）
 */
export function formatSamples(samples = [], extractionMethod = ""){


    return samples

        .filter(item => !item.ignored)

        .map(item => {

            const advice = item.result?.advice || {};

            // 污染分析：从 advice.pollution 拼接文本
            const pollutionText = (advice.pollution || [])
                .map(p => p.text)
                .join("\n") || item.result?.pollution || "无";

            // 提取过程问题分析：从 advice.extraction 拼接结构化文本
            const extractionProblemText = (advice.extraction || [])
                .map(e => {
                    return `${e.title}\n` +
                        "可能原因：" + (e.cause || []).join("；") + "\n" +
                        "涉及步骤：" + (e.step || []).join("；") + "\n" +
                        "优化建议：" + (e.solution || []).join("；");
                })
                .join("\n\n") || "无";

            return {
                id: item.id || "",
                extractionMethod: extractionMethod || item.extractionMethod || "",
                concentration: item.concentration ?? "",
                a260280: item.a260280 ?? "",
                a260230: item.a260230 ?? "",
                quality: item.result?.quality || "无法判断",
                pollution: pollutionText,
                extractionProblem: extractionProblemText,
                suggestion: item.result?.suggestion || ""
            };

        });

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
        extractionCount: summary.extractionCount || {},
        extractionChartData: summary.extractionChartData || [],
        rt: summary.rt || {}
    };

}

/**
 * 批次提取问题总结生成器
 *
 * 根据提取问题统计结果，自动生成一段总结文字，
 * 描述本批次主要问题并给出整体优化方向。
 *
 * 第9.11.3后修复：
 *   1. 当无提取问题但存在质量差样本时，给出针对性提示，
 *      避免"质量差但整体提取良好"的矛盾结论
 */


/**
 * 生成批次提取问题总结
 *
 * @param {Object} statistics  提取问题统计 { "标题": 数量, ... }
 * @param {number} totalCount  总样本数
 * @param {number} badCount    质量差样本数（可选，用于无提取问题时的兜底判断）
 * @returns {string} 总结文本
 */
export function generateBatchExtractionSummary(statistics = {}, totalCount = 0, badCount = 0){

    const keys = Object.keys(statistics);

    if(!keys.length){

        // 无提取问题统计，但可能存在质量差样本
        if(badCount > 0){
            return `本批次存在 ${badCount} 个RNA质量异常样本。` +
                "虽然未明确定位具体提取步骤问题，" +
                "但建议重点检查裂解、纯化及洗涤流程。";
        }

        return "本批次未发现明显提取流程异常，整体提取质量良好。";
    }

    const sorted = keys.sort((a, b) => statistics[b] - statistics[a]);

    const topProblem = sorted[0];
    const topCount = statistics[topProblem];

    let text = `本批次共分析 ${totalCount} 个样本，`;
    text += `主要问题为「${topProblem}」（${topCount} 个样本），`;

    if(sorted.length > 1){
        const second = sorted[1];
        text += `其次为「${second}」（${statistics[second]} 个样本）。`;
    } else {
        text += "是本批次最突出的提取质量风险点。";
    }

    text += " 建议重点检查对应提取步骤，优化相关操作流程。";

    return text;

}

/**
 * 批次提取问题总结生成器
 *
 * 根据提取问题统计结果，自动生成一段总结文字，
 * 描述本批次主要问题并给出整体优化方向。
 */


/**
 * 生成批次提取问题总结
 *
 * @param {Object} statistics  提取问题统计 { "标题": 数量, ... }
 * @param {number} totalCount  总样本数
 * @returns {string} 总结文本
 */
export function generateBatchExtractionSummary(statistics = {}, totalCount = 0){

    const keys = Object.keys(statistics);

    if(!keys.length){
        return "本批次样本未发现明显提取流程异常，整体提取质量良好。";
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

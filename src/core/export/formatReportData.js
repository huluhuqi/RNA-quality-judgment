/**
 * 报告数据格式化工具
 *
 * Excel 导出、PDF 导出、页面显示等场景共用的格式化函数。
 * 确保不同输出渠道的格式一致。
 */


/**
 * 格式化污染分析文本
 *
 * @param {Array} pollution 污染数组 [{ type, reason, level }]
 * @returns {string} 格式化后的污染文本
 */
export function formatPollutionText(pollution = []) {
    if (!pollution || pollution.length === 0) {
        return "无";
    }

    return pollution.map(p => {
        const levelLabel = getPollutionLevelLabel(p.level);
        return `${levelLabel} ${p.type}\n${p.reason || p.text}`;
    }).join("\n\n");
}


/**
 * 格式化建议文本
 *
 * @param {Array} advice 建议数组
 * @returns {string} 格式化后的建议文本
 */
export function formatAdviceText(advice = []) {
    if (!advice || advice.length === 0) {
        return "无";
    }
    return advice.join("\n\n");
}


/**
 * 格式化提取过程问题文本
 *
 * @param {Array} problems 问题数组 [{ problem, step, suggestion }]
 * @returns {string} 格式化后的问题文本
 */
export function formatExtractionProblemText(problems = []) {
    if (!problems || problems.length === 0) {
        return "未发现明显问题";
    }

    return problems.map(p => {
        return `${p.problem}\n步骤：${p.step}`;
    }).join("\n\n");
}


/**
 * 格式化提取建议文本（从问题中提取建议）
 *
 * @param {Array} problems 问题数组 [{ problem, step, suggestion }]
 * @returns {string} 格式化后的建议文本
 */
export function formatExtractionSuggestionText(problems = []) {
    if (!problems || problems.length === 0) {
        return "无";
    }

    return problems.map(p => p.suggestion).join("\n\n");
}


/**
 * 获取污染等级中文标签
 *
 * @param {string} level 等级标识 high/medium/info/normal
 * @returns {string} 中文标签
 */
export function getPollutionLevelLabel(level) {
    switch (level) {
        case 'high': return '【高风险】';
        case 'medium': return '【中等】';
        case 'info': return '【提示】';
        case 'normal': return '【正常】';
        default: return level || '';
    }
}

/**
 * RT实验建议计算
 *
 * 当RNA模板体积超过最大限制时，
 * 计算最低需要的RNA浓度，并给出实验优化建议。
 */

/**
 * 计算满足RT要求的最低RNA浓度
 *
 * @param {number} targetRNA 推荐RNA投入量 (ng)
 * @param {number} maxVolume 最大模板体积 (μL)，默认12
 * @returns {number} 最低需要浓度 (ng/μL)
 */
export function calculateRequiredConcentration(targetRNA, maxVolume = 12) {
    if (!targetRNA || targetRNA <= 0) return 0;
    return Number((targetRNA / maxVolume).toFixed(2));
}

/**
 * 根据RT状态生成实验建议文本
 *
 * @param {Object} rtStatus RT状态对象（来自 RT_STATUS 枚举）
 * @param {number} requiredConcentration 最低需要浓度 (ng/μL)
 * @returns {string} 实验建议
 */
export function generateRTSuggestion(rtStatus, requiredConcentration) {
    switch (rtStatus.code) {
        case "OK":
            return "RNA模板体积满足RT要求";
        case "NO_CONCENTRATION":
            return "请输入RNA浓度后计算RT体积";
        case "OVER_VOLUME":
            return `建议RNA浓缩至 ≥${requiredConcentration} ng/μL，或降低RNA投入量`;
        case "LOW_INPUT":
            return "建议增加RNA投入量或浓缩RNA";
        default:
            return "";
    }
}

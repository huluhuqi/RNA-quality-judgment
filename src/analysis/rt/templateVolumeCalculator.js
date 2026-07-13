/**
 * RT模板体积计算（唯一计算入口）
 *
 * 公式：体积(μL) = 推荐RNA量(ng) ÷ RNA浓度(ng/μL)
 *
 * 处理逻辑：
 *   - 缺少浓度 → NO_CONCENTRATION
 *   - 体积 ≤ maxVolume → OK（正常，计算补水体积）
 *   - 体积 > maxVolume → OVER_VOLUME（超限，waterVolume=null，计算最低需要浓度）
 *
 * ⚠ 本模块是唯一允许计算模板体积的地方。
 *   所有组件、导出、详情页禁止自行计算，必须读取 sample.rt。
 */

import { RT_STATUS } from "@/constants/rtStatus";
import { calculateRequiredConcentration, generateRTSuggestion } from "./rtSuggestion";

/**
 * 计算单个样本的模板建议体积
 *
 * @param {number|null} concentration RNA浓度 (ng/μL)
 * @param {number} targetRNA 推荐RNA投入量 (ng)
 * @param {number} maxVolume 最大模板体积 (μL)，默认12
 * @returns {Object} RT计算结果
 */
export function calculateTemplateVolume(concentration, targetRNA, maxVolume = 12) {
    // 缺少浓度
    if (
        concentration === null ||
        concentration === undefined ||
        concentration === "" ||
        isNaN(Number(concentration)) ||
        Number(concentration) <= 0
    ) {
        const status = RT_STATUS.NO_CONCENTRATION;
        return {
            templateVolume: null,
            waterVolume: null,
            status,
            statusCode: status.code,
            statusText: status.text,
            suggestion: generateRTSuggestion(status, 0),
            requiredConcentration: null
        };
    }

    const conc = Number(concentration);
    const volume = targetRNA / conc;
    const requiredConcentration = calculateRequiredConcentration(targetRNA, maxVolume);

    // 正常情况：体积不超过限制
    if (volume <= maxVolume) {
        const waterVolume = Number((maxVolume - volume).toFixed(2));
        const status = RT_STATUS.OK;
        return {
            templateVolume: Number(volume.toFixed(2)),
            waterVolume,
            status,
            statusCode: status.code,
            statusText: status.text,
            suggestion: generateRTSuggestion(status, requiredConcentration),
            requiredConcentration
        };
    }

    // 超限：体积超过最大模板体积
    const status = RT_STATUS.OVER_VOLUME;
    return {
        templateVolume: Number(volume.toFixed(2)),
        waterVolume: null,
        status,
        statusCode: status.code,
        statusText: status.text,
        suggestion: generateRTSuggestion(status, requiredConcentration),
        requiredConcentration
    };
}

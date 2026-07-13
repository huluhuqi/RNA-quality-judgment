/**
 * RT数据只读帮助函数
 *
 * 所有组件必须通过此模块读取 sample.rt 数据，
 * 禁止自行计算模板体积或补水体积。
 *
 * 唯一计算入口：src/analysis/rt/templateVolumeCalculator.js
 * 唯一写入入口：src/App.vue → refreshAnalysis()
 */

/**
 * 获取模板建议体积（只读）
 * @param {Object} sample 样本对象
 * @returns {string} 例如 "12.69 μL" 或 "无法计算"
 */
export function getTemplateVolumeDisplay(sample) {
    const volume = sample?.rt?.templateVolume;
    if (volume !== null && volume !== undefined) {
        return volume + " μL";
    }
    return "无法计算";
}

/**
 * 获取模板体积数值（只读）
 * @param {Object} sample 样本对象
 * @returns {number|null}
 */
export function getTemplateVolumeValue(sample) {
    return sample?.rt?.templateVolume ?? null;
}

/**
 * 获取RT状态码（只读）
 * @param {Object} sample 样本对象
 * @returns {string} "OK" | "OVER_VOLUME" | "NO_CONCENTRATION" | "LOW_INPUT" | ""
 */
export function getRTStatusCode(sample) {
    return sample?.rt?.statusCode || "";
}

/**
 * 获取RT状态文本（只读）
 * @param {Object} sample 样本对象
 * @returns {string} 例如 "正常" | "超过最大模板体积" | "缺少RNA浓度"
 */
export function getRTStatusText(sample) {
    return sample?.rt?.statusText || "无法计算";
}

/**
 * 获取RT建议（只读）
 * @param {Object} sample 样本对象
 * @returns {string}
 */
export function getRTSuggestion(sample) {
    return sample?.rt?.suggestion || "";
}

/**
 * 获取最低推荐浓度（只读）
 * @param {Object} sample 样本对象
 * @returns {number|null}
 */
export function getRequiredConcentration(sample) {
    return sample?.rt?.requiredConcentration ?? null;
}

/**
 * 获取推荐RNA量（只读）
 * @param {Object} sample 样本对象
 * @returns {number}
 */
export function getTargetRNA(sample) {
    return sample?.rt?.targetRNA || 0;
}

/**
 * 获取最大模板体积（只读）
 * @param {Object} sample 样本对象
 * @returns {number}
 */
export function getMaxTemplateVolume(sample) {
    return sample?.rt?.maxTemplateVolume ?? 12;
}

/**
 * 获取补水体积（只读）
 * @param {Object} sample 样本对象
 * @returns {string} 例如 "1.89 μL" 或 "无法配置"
 */
export function getWaterVolumeDisplay(sample) {
    const wv = sample?.rt?.waterVolume;
    if (wv !== null && wv !== undefined) {
        return wv + " μL";
    }
    return "无法配置";
}

/**
 * 获取补水体积数值（只读）
 * @param {Object} sample 样本对象
 * @returns {number|null}
 */
export function getWaterVolumeValue(sample) {
    return sample?.rt?.waterVolume ?? null;
}

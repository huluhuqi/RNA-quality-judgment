/**
 * RT数据只读帮助函数
 *
 * 所有组件必须通过此模块读取 sample.rt 数据，
 * 禁止自行计算模板体积或补水体积。
 *
 * 唯一计算入口：
 *   - 模板体积：src/analysis/rt/templateVolumeCalculator.js
 *   - 补水体积：src/analysis/rt/waterVolumeCalculator.js
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
 * 获取RT状态（只读）
 * @param {Object} sample 样本对象
 * @returns {string}
 */
export function getRTStatus(sample) {
    return sample?.rt?.status || "无法计算";
}

/**
 * 获取推荐RNA量（只读）
 * @param {Object} sample 样本对象
 * @returns {number}
 */
export function getTargetRNA(sample) {
    return sample?.rt?.targetRNA || sample?.rt?.recommendedRNA || 0;
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
 * @returns {string} 例如 "1.89 μL" 或 "无法计算"
 */
export function getWaterVolumeDisplay(sample) {
    const wv = sample?.rt?.waterVolume;
    if (wv !== null && wv !== undefined) {
        return wv + " μL";
    }
    return "无法计算";
}

/**
 * 获取补水体积数值（只读）
 * @param {Object} sample 样本对象
 * @returns {number|null}
 */
export function getWaterVolumeValue(sample) {
    return sample?.rt?.waterVolume ?? null;
}

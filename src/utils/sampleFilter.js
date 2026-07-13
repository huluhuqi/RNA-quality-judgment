/**
 * 样本状态统一过滤模块
 *
 * 全局唯一规则：
 *   被忽略样本 = sample.status.ignored === true
 *   不再使用 sample.ignored（旧字段，仅做兼容回退）
 *
 * 所有模块必须通过此模块判断样本是否被忽略，
 * 禁止在各处直接写 sample.ignored 或 sample.status?.ignored。
 */

/**
 * 判断样本是否被忽略
 * @param {Object} sample 样本对象
 * @returns {boolean}
 */
export function isIgnored(sample) {
    return sample?.status?.ignored === true;
}

/**
 * 获取有效样本（排除被忽略的）
 * @param {Array} samples 样本数组
 * @returns {Array} 有效样本数组
 */
export function getActiveSamples(samples = []) {
    return samples.filter(s => !isIgnored(s));
}

/**
 * 获取忽略样本
 * @param {Array} samples 样本数组
 * @returns {Array} 忽略样本数组
 */
export function getIgnoredSamples(samples = []) {
    return samples.filter(s => isIgnored(s));
}

/**
 * 获取有效样本数量
 * @param {Array} samples 样本数组
 * @returns {number}
 */
export function getActiveCount(samples = []) {
    return getActiveSamples(samples).length;
}

/**
 * 获取忽略样本数量
 * @param {Array} samples 样本数组
 * @returns {number}
 */
export function getIgnoredCount(samples = []) {
    return getIgnoredSamples(samples).length;
}

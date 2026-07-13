/**
 * 样本状态统一过滤模块
 *
 * 全局唯一规则：
 *   有效样本 = 未被忽略 && 未被删除
 *   被忽略样本 = sample.status.ignored === true
 *   被删除样本 = sample.deleted === true (预留，当前未使用)
 *
 * 所有模块必须通过此模块判断样本有效性，
 * 禁止在各处直接写 sample.ignored / sample.status?.ignored / sample.deleted。
 */

/**
 * 判断样本是否被忽略
 * @param {Object} sample 样本对象
 * @returns {boolean}
 */
export function isIgnored(sample) {
    if (!sample) return false;
    return sample.status?.ignored === true || sample.ignored === true;
}

/**
 * 判断样本是否被删除
 * @param {Object} sample 样本对象
 * @returns {boolean}
 */
export function isDeleted(sample) {
    if (!sample) return true;
    return sample.deleted === true;
}

/**
 * 判断样本是否为有效样本（未忽略 && 未删除）
 * @param {Object} sample 样本对象
 * @returns {boolean}
 */
export function isActiveSample(sample) {
    if (!sample) return false;
    if (isDeleted(sample)) return false;
    if (isIgnored(sample)) return false;
    return true;
}

/**
 * 获取有效样本（排除被忽略和被删除的）
 * @param {Array} samples 样本数组
 * @returns {Array} 有效样本数组
 */
export function getActiveSamples(samples = []) {
    if (!Array.isArray(samples)) return [];
    return samples.filter(s => isActiveSample(s));
}

/**
 * 获取忽略样本
 * @param {Array} samples 样本数组
 * @returns {Array} 忽略样本数组
 */
export function getIgnoredSamples(samples = []) {
    if (!Array.isArray(samples)) return [];
    return samples.filter(s => isIgnored(s) && !isDeleted(s));
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

/**
 * RNA样本统一处理工具
 *
 * 所有样本过滤、数量统计、数值转换等通用逻辑统一在此处定义。
 * 避免在各个模块重复实现，确保修改一处全局生效。
 */


/**
 * 获取有效样本
 * 排除被忽略的数据
 *
 * @param {Array} samples 样本数组
 * @returns {Array} 有效样本数组
 */
export function getValidSamples(samples = []) {
    return samples.filter(item => !item.ignored);
}


/**
 * 获取有效样本数量
 *
 * @param {Array} samples 样本数组
 * @returns {number} 有效样本数
 */
export function getSampleCount(samples = []) {
    return getValidSamples(samples).length;
}


/**
 * 判断样本是否为空
 *
 * @param {Object} sample 样本对象
 * @returns {boolean} 是否为空
 */
export function isEmptySample(sample) {
    return !sample || Object.keys(sample).length === 0;
}


/**
 * 安全获取数值
 * 空值/非数字 → null
 *
 * @param {*} value 原始值
 * @returns {number|null} 数值或null
 */
export function getNumber(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const num = Number(value);

    return Number.isNaN(num) ? null : num;
}


/**
 * 判断值是否存在（非空且为有效数字）
 *
 * @param {*} value 原始值
 * @returns {boolean} 是否存在
 */
export function isPresent(value) {
    if (value === null || value === undefined || value === "") {
        return false;
    }
    return !Number.isNaN(Number(value));
}

/**
 * 安全值工具
 *
 * 统一处理空值、NaN、undefined，防止页面显示 NaN 或空白。
 */

/**
 * 安全值 - 空值返回空字符串
 * @param {*} value
 * @param {string} fallback 降级值，默认空字符串
 * @returns {*}
 */
export function safeValue(value, fallback = "") {
    if (value === null || value === undefined) {
        return fallback;
    }
    if (typeof value === "number" && isNaN(value)) {
        return fallback;
    }
    if (typeof value === "string" && value === "NaN") {
        return fallback;
    }
    if (value === Infinity || value === -Infinity) {
        return fallback;
    }
    return value;
}

/**
 * 安全数值 - 空值返回 0
 * @param {*} value
 * @param {number} fallback 降级值，默认0
 * @returns {number}
 */
export function safeNumber(value, fallback = 0) {
    const n = Number(value);
    if (isNaN(n) || !isFinite(n)) {
        return fallback;
    }
    return n;
}

/**
 * 安全显示文本 - 空值显示"-"
 * @param {*} value
 * @param {string} fallback 降级值，默认"-"
 * @returns {string}
 */
export function safeDisplay(value, fallback = "-") {
    const v = safeValue(value, null);
    if (v === null || v === "") {
        return fallback;
    }
    return String(v);
}

/**
 * 安全数组 - 空值返回空数组
 * @param {*} arr
 * @returns {Array}
 */
export function safeArray(arr) {
    if (Array.isArray(arr)) return arr;
    return [];
}

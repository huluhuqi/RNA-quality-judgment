/**
 * 导出数据验证器
 *
 * 确保导出前数据完整性，避免导出空数据或错误数据。
 */

/**
 * 验证导出数据
 * @param {Object} data 导出数据对象
 * @returns {boolean}
 * @throws {Error} 验证失败时抛出错误
 */
export function validateExport(data) {
    if (!data) {
        throw new Error("导出数据为空");
    }

    if (!data.samples || !Array.isArray(data.samples)) {
        throw new Error("导出样本数据格式错误");
    }

    if (data.samples.length === 0) {
        throw new Error("没有有效样本可导出");
    }

    return true;
}

/**
 * 安全验证（不抛出异常）
 * @param {Object} data 导出数据对象
 * @returns {{ valid: boolean, message: string }}
 */
export function safeValidateExport(data) {
    try {
        validateExport(data);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

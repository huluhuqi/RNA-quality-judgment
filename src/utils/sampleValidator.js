/**
 * 样本验证器
 *
 * 验证样本数据的完整性和正确性，包括：
 *   - 重复模板ID检测
 *   - 必填字段验证
 *   - 数值范围验证
 */

/**
 * 检测重复的模板ID
 * @param {Array} samples 样本数组
 * @returns {Array} 重复的模板ID列表
 */
export function checkDuplicateTemplateId(samples) {
    const map = new Map();
    const duplicates = [];

    samples.forEach(sample => {
        const id = sample.raw?.templateId || sample.templateId;
        if (id) {
            if (map.has(id)) {
                if (!duplicates.includes(id)) {
                    duplicates.push(id);
                }
            } else {
                map.set(id, true);
            }
        }
    });

    return duplicates;
}

/**
 * 验证单个样本数据
 * @param {Object} sample 样本对象
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateSample(sample) {
    const errors = [];

    if (!sample.raw?.templateId || String(sample.raw.templateId).trim() === '') {
        errors.push('模板ID不能为空');
    }

    const conc = sample.raw?.concentration;
    if (conc !== null && conc !== undefined && conc !== '') {
        const num = Number(conc);
        if (isNaN(num) || num < 0) {
            errors.push('RNA浓度必须是非负数字');
        }
    }

    const a260280 = sample.raw?.a260280;
    if (a260280 !== null && a260280 !== undefined && a260280 !== '') {
        const num = Number(a260280);
        if (isNaN(num) || num <= 0) {
            errors.push('A260/A280必须是正数');
        }
    }

    const a260230 = sample.raw?.a260230;
    if (a260230 !== null && a260230 !== undefined && a260230 !== '') {
        const num = Number(a260230);
        if (isNaN(num) || num <= 0) {
            errors.push('A260/A230必须是正数');
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * 批量验证样本数据
 * @param {Array} samples 样本数组
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateSamples(samples) {
    const errors = [];
    const duplicates = checkDuplicateTemplateId(samples);

    if (duplicates.length > 0) {
        errors.push(`检测到重复模板ID: ${duplicates.join(', ')}`);
    }

    samples.forEach((sample, index) => {
        const result = validateSample(sample);
        if (!result.valid) {
            const id = sample.raw?.templateId || `样本${index + 1}`;
            errors.push(`${id}: ${result.errors.join('; ')}`);
        }
    });

    return { valid: errors.length === 0, errors };
}

/**
 * 数据迁移工具
 *
 * 处理历史版本数据的兼容性问题，
 * 确保 localStorage 中旧数据能正常加载并自动修复。
 *
 * 版本号规则：MAJOR.MINOR.PATCH
 *   - MAJOR: 破坏性变更（数据结构完全不同）
 *   - MINOR: 新增字段（向下兼容）
 *   - PATCH: Bug修复
 */

import { createSample, normalizeSample } from "@/models/SampleModel";
import { createRTResult } from "@/models/rtModel";

export const DATA_VERSION = "1.0.0";

/**
 * 迁移单个样本 - 确保所有必要字段存在
 * @param {Object} sample 原始样本数据
 * @returns {Object} 迁移后的样本数据
 */
export function migrateSample(sample) {
    if (!sample || typeof sample !== "object") {
        return createSample({});
    }

    const migrated = { ...sample };

    if (!migrated.id) {
        migrated.id = crypto.randomUUID();
    }

    if (!migrated.raw) {
        migrated.raw = {
            templateId: migrated.templateId || "",
            concentration: migrated.concentration ?? null,
            a260280: migrated.a260280 ?? null,
            a260230: migrated.a260230 ?? null
        };
    } else {
        migrated.raw = {
            templateId: migrated.raw.templateId || migrated.templateId || "",
            concentration: migrated.raw.concentration ?? migrated.concentration ?? null,
            a260280: migrated.raw.a260280 ?? migrated.a260280 ?? null,
            a260230: migrated.raw.a260230 ?? migrated.a260230 ?? null
        };
    }

    if (!migrated.status) {
        migrated.status = { ignored: false };
    } else if (migrated.status.ignored === undefined) {
        migrated.status.ignored = false;
    }

    if (migrated.ignored !== undefined) {
        migrated.status.ignored = migrated.ignored === true;
        delete migrated.ignored;
    }

    if (!migrated.rt || typeof migrated.rt !== "object") {
        migrated.rt = createRTResult();
    } else {
        const baseRT = createRTResult();
        migrated.rt = { ...baseRT, ...migrated.rt };
    }

    if (migrated.deleted === undefined) {
        migrated.deleted = false;
    }

    return migrated;
}

/**
 * 批量迁移样本数据
 * @param {Array} samples
 * @returns {Array}
 */
export function migrateSamples(samples) {
    if (!Array.isArray(samples)) return [];
    return samples.map(s => migrateSample(s));
}

/**
 * 检查数据版本，执行必要的迁移
 * @param {Object} storedData { version, samples }
 * @returns {Array} 迁移后的样本数组
 */
export function migrateStoredData(storedData) {
    if (!storedData) return [];

    const samples = Array.isArray(storedData) ? storedData : (storedData.samples || []);
    return migrateSamples(samples);
}

/**
 * 包装存储数据（带版本号）
 * @param {Array} samples
 * @returns {Object} { version, samples }
 */
export function wrapWithVersion(samples) {
    return {
        version: DATA_VERSION,
        samples: Array.isArray(samples) ? samples : []
    };
}

/**
 * 解包存储数据（自动迁移）
 * @param {*} storedData
 * @returns {Array} 样本数组
 */
export function unwrapWithMigration(storedData) {
    if (!storedData) return [];

    if (Array.isArray(storedData)) {
        return migrateSamples(storedData);
    }

    if (storedData && Array.isArray(storedData.samples)) {
        return migrateSamples(storedData.samples);
    }

    return [];
}

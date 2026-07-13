/**
 * 数据一致性检测工具
 *
 * 发布前验证：确保RT数据内部逻辑一致，
 * 避免出现"体积超限但状态OK"之类的矛盾数据。
 */

import { RT_STATUS } from "@/constants/rtStatus";

const isDev = import.meta.env?.DEV ?? false;

/**
 * 检查RT数据一致性
 *
 * 检测规则：
 * 1. templateVolume > maxTemplateVolume 时，status不应为OK
 * 2. templateVolume <= maxTemplateVolume 时，status应为OK
 * 3. waterVolume在OK时应有值，在OVER_VOLUME时应为null
 * 4. OVER_VOLUME时requiredConcentration应有值
 *
 * @param {Array} samples 样本数组
 * @returns {Array} 异常样本列表
 */
export function checkRTConsistency(samples = []) {
    const errors = [];

    samples.forEach((sample, index) => {
        const rt = sample.rtConfig || sample.rt;
        if (!rt) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: "缺少rt字段",
                rt
            });
            return;
        }

        const { templateVolume, waterVolume, maxTemplateVolume, statusCode, requiredConcentration } = rt;

        if (templateVolume === null || templateVolume === undefined) {
            if (statusCode !== RT_STATUS.NO_CONCENTRATION.code) {
                errors.push({
                    index,
                    templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                    error: `模板体积为空但status=${statusCode}`,
                    rt
                });
            }
            return;
        }

        const maxVol = maxTemplateVolume ?? 12;
        const isOverVolume = templateVolume > maxVol;

        if (isOverVolume && statusCode === RT_STATUS.OK.code) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: `体积${templateVolume}μL超过${maxVol}μL但状态为OK`,
                rt
            });
        }

        if (!isOverVolume && statusCode === RT_STATUS.OVER_VOLUME.code) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: `体积${templateVolume}μL未超限但状态为OVER_VOLUME`,
                rt
            });
        }

        if (statusCode === RT_STATUS.OK.code && (waterVolume === null || waterVolume === undefined)) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: "状态为OK但补水体积为空",
                rt
            });
        }

        if (statusCode === RT_STATUS.OVER_VOLUME.code && waterVolume !== null) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: `状态为OVER_VOLUME但补水体积为${waterVolume}`,
                rt
            });
        }

        if (statusCode === RT_STATUS.OVER_VOLUME.code && (requiredConcentration === null || requiredConcentration === undefined)) {
            errors.push({
                index,
                templateId: sample.templateId || sample.raw?.templateId || `index_${index}`,
                error: "状态为OVER_VOLUME但缺少最低推荐浓度",
                rt
            });
        }
    });

    return errors;
}

/**
 * 安全的RT一致性检查（异常捕获）
 * @param {Array} samples
 * @returns {Array} 异常列表
 */
export function safeCheckRTConsistency(samples) {
    try {
        return checkRTConsistency(samples);
    } catch (e) {
        console.error("RT一致性检查失败:", e);
        return [];
    }
}

/**
 * 打印RT一致性检查结果到控制台
 * @param {Array} samples
 */
export function logRTConsistency(samples) {
    const errors = safeCheckRTConsistency(samples);
    if (errors.length > 0) {
        console.error(`[RT一致性检查] 发现 ${errors.length} 个异常:`, errors);
    } else if (isDev) {
        console.log(`[RT一致性检查] 通过，共 ${samples.length} 个样本`);
    }
    return errors;
}

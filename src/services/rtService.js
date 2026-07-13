/**
 * RT计算统一服务
 *
 * 所有模块必须通过此服务计算单样本RT，
 * 禁止自行计算模板体积或补水体积。
 *
 * 核心计算委托给：src/analysis/rt/templateVolumeCalculator.js
 * 批次推荐使用：src/core/RTRecommendation.js → calculateRT()
 */

import { calculateTemplateVolume } from "@/analysis/rt/templateVolumeCalculator";
import { createRTResult } from "@/models/rtModel";

/**
 * 计算单个样本的RT体系配置
 *
 * @param {Object} sample 样本对象
 * @param {number} targetRNA 目标RNA投入量(ng)
 * @param {number} maxVolume 最大模板体积(μL)，默认12
 * @returns {Object} 完整的RT结果对象
 */
export function calculateSampleRT(sample, targetRNA = 100, maxVolume = 12) {
    const rt = createRTResult();

    const conc = sample?.raw?.concentration ?? sample?.concentration;
    const concentration = (conc === "" || conc === null || conc === undefined) ? null : Number(conc);

    rt.targetRNA = targetRNA;
    rt.concentration = concentration;
    rt.maxTemplateVolume = maxVolume;

    const result = calculateTemplateVolume(concentration, targetRNA, maxVolume);

    rt.templateVolume = result.templateVolume;
    rt.waterVolume = result.waterVolume;
    rt.statusCode = result.statusCode;
    rt.statusText = result.statusText;
    rt.suggestion = result.suggestion;
    rt.requiredConcentration = result.requiredConcentration;
    rt.calculatedAt = new Date().toISOString();

    return rt;
}

/**
 * 批量计算样本RT
 *
 * @param {Array} samples 样本数组
 * @param {number} targetRNA 目标RNA投入量
 * @param {number} maxVolume 最大模板体积
 * @returns {Array} 样本数组（已修改原对象）
 */
export function calculateBatchRT(samples, targetRNA = 100, maxVolume = 12) {
    if (!samples || !Array.isArray(samples)) return [];

    samples.forEach(sample => {
        sample.rt = calculateSampleRT(sample, targetRNA, maxVolume);
    });

    return samples;
}

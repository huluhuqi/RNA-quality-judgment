/**
 * RNA质量评级
 *
 * 第7步：升级为新质量评分算法
 * 
 * 评分规则（总分100分）：
 *   - A260/280：40分权重
 *   - A260/230：40分权重
 *   - 综合风险：20分权重
 *
 * 根据下游实验用途自动调整阈值：
 *   - normal: 常规RT
 *   - qpcr:   RT-qPCR
 *   - rnaseq: RNA-seq
 *   - smallRNA: 小核酸实验
 */
import { calculateRNAQuality } from "./rnaQualityScore";
import { PENDING } from "../../config/qualityLevel";


export function judgeQuality(sample, application) {

    const a280 = parseFloat(sample.a260280);

    if (isNaN(a280)) {
        return PENDING.value;
    }

    const result = calculateRNAQuality(sample, application);

    return result.levelValue;

}


/**
 * 获取完整质量分析结果（包含评分、等级、详情、风险提示）
 *
 * @param {Object} sample 样本数据
 * @param {string} application 下游实验用途
 * @returns {Object} 完整质量分析结果
 */
export function analyzeQuality(sample, application) {

    const a280 = parseFloat(sample.a260280);

    if (isNaN(a280)) {
        return {
            quality: PENDING.value,
            score: null,
            detail: ["未检测A260/280，无法判断"],
            riskMessage: "缺少关键检测数据"
        };
    }

    const result = calculateRNAQuality(sample, application);

    return {
        quality: result.levelValue,
        score: result.score,
        detail: result.detail,
        riskMessage: result.riskMessage
    };

}

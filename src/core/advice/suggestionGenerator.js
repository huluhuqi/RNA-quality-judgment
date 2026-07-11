/**
 * 统一建议生成器
 *
 * 整合污染判断、提取溯源、浓度建议，
 * 输出完整的 advice 对象，写入 sample.result.advice。
 *
 * 不改变现有 RNA 质量判断逻辑，只扩展建议信息。
 */

import { judgePollution } from "./pollutionJudge"
import { getExtractionAdvice } from "./extractionAdvice"
import { getConcentrationAdvice } from "./concentrationAdvice"


/**
 * 生成完整的样本建议
 *
 * @param {Object} sample    样本对象（含 a260280, a260230, concentration）
 * @param {string} method    提取方法名
 * @param {Object} rtConfig  RT 参数配置（可选）
 * @returns {Object} { pollution, extraction, concentration }
 */
export function generateAdvice(sample, method, rtConfig = {}){

    const pollution = judgePollution(sample);
    const extraction = getExtractionAdvice(method, pollution);
    const concentration = getConcentrationAdvice(sample, rtConfig);

    return {
        pollution,
        extraction,
        concentration
    };

}

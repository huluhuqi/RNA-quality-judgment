/**
 * 统一样本分析入口
 *
 * RNA 质量分析只执行一次，结果写入 sample.result，
 * 所有组件（表格/总结/Excel/PDF）统一读取，避免重复计算。
 *
 * result 结构：
 * {
 *   quality, pollution, pollutionText, suggestion, pollutionType, diagnosis,
 *   advice: {
 *     pollution:    [{ type, level, text }],
 *     extraction:   [{ type, level, title, cause, step, solution }],
 *     concentration:[{ type, level, text, suggestion }]
 *   }
 * }
 */
import { analyzeRNA } from "../quality"
import { generateAdvice } from "../advice"


/**
 * 单个样本分析
 *
 * @param {Object} sample  标准化样本
 * @param {Object} config  { method, application, ...rtConfig }
 * @returns {Object} 带有 result 字段的样本
 */
export function analyzeSample(sample, config = {}){


    if(sample.ignored){
        return {
            ...sample,
            result: null
        };
    }


    const qualityResult = analyzeRNA(
        sample,
        config.method,
        config.application
    )

    const advice = generateAdvice(
        sample,
        config.method,
        config
    )


    return {
        ...sample,
        result: {
            ...qualityResult,
            advice
        }
    };


}


/**
 * 批量分析
 *
 * @param {Array} samples
 * @param {Object} config  { method, application }
 * @returns {Array} 每个样本带有 result 字段
 */
export function analyzeSamples(samples = [], config = {}){


    return samples.map(sample =>
        analyzeSample(sample, config)
    );


}

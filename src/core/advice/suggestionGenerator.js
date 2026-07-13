/**
 * 统一建议生成器
 *
 * 整合污染判断、提取溯源、浓度建议，
 * 输出完整的 advice 对象，写入 sample.result.advice。
 *
 * 不改变现有 RNA 质量判断逻辑，只扩展建议信息。
 *
 * 第9.11.3后修复：
 *   1. 增加异常兜底分析，保证每个异常样本都有提取流程建议
 *   2. extraction 内部区分 confirmed（数据库匹配）与 risk（指标推测）
 */

import { judgePollution } from "./pollutionJudge"
import { getExtractionAdvice } from "./extractionAdvice"
import { getConcentrationAdvice } from "./concentrationAdvice"
import { analyzeExtractionProblem } from "./extractionProblemAnalyzer"


/**
 * 根据样本指标生成兜底提取流程建议
 *
 * 当数据库未匹配到具体方法、或匹配到方法但无对应污染类型时，
 * 依据 A260/280、A260/230 比值推断可能问题，保证每个异常样本都有分析。
 *
 * @param {Object} sample  样本对象
 * @returns {Array} 兜底提取建议列表
 */
function generateFallbackExtraction(sample){

    const result = [];

    const a280 = Number(sample.a260280);
    const a230 = Number(sample.a260230);

    // 没有任何纯度数据时不生成兜底建议
    if(sample.a260280 == null && sample.a260230 == null){
        return result;
    }

    if(!isNaN(a280) && a280 && a280 < 1.8){
        result.push({
            type: "protein",
            level: a280 < 1.5 ? "严重" : "轻度",
            title: "蛋白质/酚类去除不足风险",
            cause: [
                "裂解后杂质去除不充分",
                "纯化步骤可能存在蛋白残留",
                "样本上样量超过柱膜处理能力"
            ],
            step: [
                "检查裂解步骤",
                "检查蛋白去除步骤",
                "检查纯化柱负载"
            ],
            solution: [
                "延长裂解时间",
                "优化纯化步骤",
                "必要时增加RNA纯化"
            ]
        });
    }

    if(!isNaN(a230) && a230 && a230 < 1.8){
        result.push({
            type: "guanidine",
            level: a230 < 1.0 ? "严重" : "轻度",
            title: "盐类或提取试剂残留风险",
            cause: [
                "洗涤不充分",
                "乙醇或胍盐残留",
                "干燥步骤不足"
            ],
            step: [
                "检查洗涤步骤",
                "检查干燥离心时间"
            ],
            solution: [
                "增加洗涤步骤",
                "延长干燥离心时间",
                "必要时进行RNA cleanup"
            ]
        });
    }

    // 若两项指标均无异常，不生成兜底建议
    // 仅在实际有异常但未匹配到具体分类时给出通用建议
    if(result.length === 0){

        const hasAbnormal280 =
            sample.a260280 != null
            && (a280 < 1.8 || a280 > 2.2);

        const hasAbnormal230 =
            sample.a260230 != null
            && a230 < 1.8;

        if(hasAbnormal280 || hasAbnormal230){
            result.push({
                type: "general",
                level: "轻度",
                title: "RNA质量异常，建议检查提取流程",
                cause: [
                    "RNA质量较差但具体指标未明显异常",
                    "可能存在复合污染或操作误差"
                ],
                step: [
                    "检查整体提取流程",
                    "确认样本保存条件"
                ],
                solution: [
                    "重新提取RNA",
                    "优化提取条件",
                    "必要时进行RNA纯化"
                ]
            });
        }

    }

    return result;

}


/**
 * 生成完整的样本建议
 *
 * @param {Object} sample    样本对象（含 a260280, a260230, concentration）
 * @param {string} method    提取方法名
 * @param {Object} rtConfig  RT 参数配置（可选）
 * @returns {Object} { pollution, extraction, concentration }
 *                    extraction 项含 source: "confirmed" | "risk"
 */
export function generateAdvice(sample, method, rtConfig = {}){

    const pollution = judgePollution(sample);

    const extractionProblem = analyzeExtractionProblem({ ...sample, extractionMethod: method }, pollution);

    let extraction = getExtractionAdvice(method, pollution);
    let extractionSource = "confirmed";

    // 数据库未匹配到具体建议时，使用指标兜底分析
    if(!extraction.length){
        extraction = generateFallbackExtraction(sample);
        extractionSource = "risk";
    }

    // 标注每项来源
    extraction = extraction.map(item => ({
        ...item,
        source: extractionSource
    }));

    const concentration = getConcentrationAdvice(sample, rtConfig);

    return {
        pollution,
        extraction,
        concentration,
        extractionProblem
    };

}

/**
 * 提取流程问题分析
 *
 * 根据污染类型 + 提取方法，推断可能出问题的步骤和优化建议。
 * 使用 contaminationMapping 统一处理英文/中文污染类型。
 */

import { normalizeContaminationType } from "../../config/contaminationMapping"
import { getExtractionMethodId } from "../../config/extractionMethodMap"
import { getExtractionDatabase } from "../extraction"

/**
 * 分析提取流程问题
 *
 * @param {Object} sample  含 extractionMethod 字段
 * @param {Array}  pollution  judgePollution 输出 [{ type, level, text }]
 * @returns {Array} [{ problem, step, suggestion }]
 */
export function analyzeExtractionProblem(sample, pollution) {

    const methodId = getExtractionMethodId(sample.extractionMethod) || "column"
    const database = getExtractionDatabase(methodId)

    const result = []

    pollution.forEach(item => {

        const normalizedType = normalizeContaminationType(item.type)

        // 优先从数据库获取结构化建议
        if (database?.pollution?.[normalizedType]) {
            const data = database.pollution[normalizedType]
            result.push({
                problem: data.title,
                step: (data.step || []).join("；"),
                suggestion: (data.solution || []).join("；")
            })
            return
        }

        // 兜底：按类型给出通用建议
        if (normalizedType === "protein") {
            result.push({
                problem: "蛋白去除不足",
                step: "裂解、分相或洗涤步骤",
                suggestion: "检查裂解步骤是否充分；增加蛋白去除步骤；避免样本过量导致杂质残留"
            })
        }

        if (normalizedType === "guanidine") {
            result.push({
                problem: "盐类或试剂残留",
                step: "洗涤和干燥步骤",
                suggestion: "检查洗涤步骤；增加RPE洗涤次数；延长空柱离心时间；避免膜柱残留胍盐污染"
            })
        }

        if (normalizedType === "ethanol") {
            result.push({
                problem: "乙醇残留",
                step: "干燥步骤",
                suggestion: "检查柱膜干燥步骤；延长空柱离心时间；避免洗液残留进入洗脱步骤"
            })
        }

    })

    return result
}

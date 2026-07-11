/**
 * 兼容入口 - 已迁移至 src/core/extraction/
 *
 * 保留此文件以维持对旧路径的引用，
 * 新代码请使用：import { extractionDatabase } from "@/core/extraction"
 */

import { extractionDatabase } from "../core/extraction"


/**
 * 旧 API：按方法名 + 类型（low280/low230）获取诊断数据
 *
 * @param {string} method  方法名
 * @param {string} type    "low280" | "low230"
 * @returns {Object|null}
 */
export function getExtractionAdvice(method, type){

    const methodData = extractionDatabase[method]
    if(!methodData) return null

    const typeMap = {
        low280: "protein",
        low230: "guanidine"
    }

    const key = typeMap[type]
    if(!key) return null

    const data = methodData.pollution[key]
    if(!data) return null

    return {
        title: data.title,
        reason: data.cause,
        step: data.step,
        optimization: data.solution
    }

}

/**
 * 兼容入口 - 已迁移至 src/core/extraction/
 *
 * 保留此文件以维持对旧路径的引用，
 * 新代码请直接使用 extractionDatabase。
 */

import { extractionDatabase } from "../core/extraction"


/**
 * 将 extractionDatabase 转换为旧格式（low280/low230 → protein/guanidine）
 */
function toLegacyFormat(db){
    const result = {}
    Object.entries(db).forEach(([methodName, methodData]) => {
        result[methodName] = {
            low280: {
                title: methodData.pollution.protein.title,
                reason: methodData.pollution.protein.cause,
                step: methodData.pollution.protein.step,
                optimization: methodData.pollution.protein.solution
            },
            low230: {
                title: methodData.pollution.guanidine.title,
                reason: methodData.pollution.guanidine.cause,
                step: methodData.pollution.guanidine.step,
                optimization: methodData.pollution.guanidine.solution
            }
        }
    })
    return result
}


export const extractionDiagnosis = toLegacyFormat(extractionDatabase)

/**
 * 兼容入口 - 已迁移至 src/core/extraction/
 *
 * 保留此文件以维持对旧路径的引用，
 * 新代码请使用：import { extractionDatabase, extractionMethods } from "@/core/extraction"
 */

import {
    extractionDatabase,
    extractionMethods as newMethods
} from "../core/extraction"


/**
 * 提取方法名称列表（字符串数组，兼容旧 API）
 */
export const extractionMethods = newMethods.map(m => m.value)


export { extractionDatabase }

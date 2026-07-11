/**
 * 兼容入口 - 已迁移至 src/core/extraction/
 *
 * 保留此文件以维持对旧路径的引用，
 * 新代码请使用：import { extractionDatabase, extractionMethods } from "@/core/extraction"
 */

import {
    extractionDatabase,
    extractionMethods as newMethods,
    getExtractionMethodId
} from "../core/extraction"


/**
 * 提取方法名称列表（字符串数组，兼容旧 API）
 * 返回中文名，用于 RTParameter 下拉选择
 */
export const extractionMethods = newMethods.map(m => m.label)


/**
 * 兼容旧的按中文名查找的方式
 * 将中文 key 映射到数据库对象
 */
const legacyDatabase = {};
newMethods.forEach(m => {
    const data = extractionDatabase[m.value];
    if(data){
        legacyDatabase[m.label] = data;
    }
});

export { legacyDatabase as extractionDatabase, getExtractionMethodId }

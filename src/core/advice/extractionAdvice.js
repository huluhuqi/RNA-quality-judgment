/**
 * 提取过程溯源建议
 *
 * 根据提取方法 + 污染类型，从数据库中查找：
 * - 污染标题
 * - 可能原因（cause）
 * - 可能出问题的步骤（step）
 * - 优化建议（solution）
 */

import { extractionDatabase } from "../extraction"


/**
 * 获取提取过程建议
 *
 * @param {string} method     提取方法名（如 "硅胶膜柱提法"）
 * @param {Array}  pollutions 污染类型数组 [{ type, level, text }]
 * @returns {Array} 建议列表 [{ title, cause, step, solution }]
 */
export function getExtractionAdvice(method, pollutions = []){

    const database = extractionDatabase[method];

    if(!database) return [];

    const result = [];

    pollutions.forEach(item => {

        const data = database.pollution[item.type];

        if(data){
            result.push({
                type: item.type,
                level: item.level,
                title: data.title,
                cause: data.cause,
                step: data.step,
                solution: data.solution
            });
        }

    });

    return result;

}

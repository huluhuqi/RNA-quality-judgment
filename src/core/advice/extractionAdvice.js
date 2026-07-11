/**
 * 提取过程溯源建议
 *
 * 根据提取方法 + 污染类型，从数据库中查找：
 * - 污染标题
 * - 可能原因（cause）
 * - 可能出问题的步骤（step）
 * - 优化建议（solution）
 *
 * 自动处理方法名 → 内部ID映射，支持中文名和ID两种输入。
 */

import { getExtractionDatabase } from "../extraction"


/**
 * 获取提取过程建议
 *
 * @param {string} method     提取方法名（中文名或内部ID）
 * @param {Array}  pollutions 污染类型数组 [{ type, level, text }]
 * @returns {Array} 建议列表 [{ type, level, title, cause, step, solution }]
 */
export function getExtractionAdvice(method, pollutions = []){

    const database = getExtractionDatabase(method);

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

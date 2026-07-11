/**
 * 污染类型判断
 *
 * 根据 A260/280 和 A260/230 比值判断污染类型及严重程度。
 * 不进行 RNA 质量评级，只输出污染类型，供后续生成溯源建议使用。
 *
 * 输入：sample 样本对象（含 a260280, a260230）
 * 输出：[{ type, level, text }] 污染类型列表
 */


/**
 * 判断样本的污染类型
 *
 * @param {Object} sample  样本对象
 * @param {number} sample.a260280   A260/A280 比值
 * @param {number} sample.a260230   A260/A230 比值
 * @returns {Array} 污染类型数组，每项含 { type, level, text }
 */
export function judgePollution(sample){

    const result = [];

    if(sample.a260280 != null && sample.a260280 < 1.8){
        result.push({
            type: "protein",
            level: sample.a260280 < 1.5 ? "严重" : "轻度",
            text: "A260/280偏低，提示蛋白质或酚类污染风险"
        });
    }

    if(sample.a260230 != null && sample.a260230 < 1.8){
        result.push({
            type: "guanidine",
            level: sample.a260230 < 1.0 ? "严重" : "轻度",
            text: "A260/230偏低，提示胍盐、盐类或提取试剂残留风险"
        });
    }

    return result;

}

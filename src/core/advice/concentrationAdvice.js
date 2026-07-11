/**
 * 浓度建议生成
 *
 * 根据 RNA 浓度与 RT 参数，判断浓度异常并给出调整建议。
 * 预留模块：当前主要用于高浓度/低浓度场景的操作建议。
 */


/**
 * 生成浓度相关建议
 *
 * @param {Object} sample    样本对象
 * @param {Object} rtConfig  RT 参数配置
 * @returns {Array} 建议列表
 */
export function getConcentrationAdvice(sample, rtConfig = {}){

    const result = [];

    if(sample.concentration == null) return result;

    const conc = Number(sample.concentration);

    if(isNaN(conc) || conc <= 0) return result;

    if(conc < 10){
        result.push({
            type: "low",
            level: "轻度",
            text: "RNA浓度偏低，建议增加样本量或优化提取效率",
            suggestion: [
                "增加初始样本量",
                "优化裂解条件",
                "减少洗脱液体积以提高浓度"
            ]
        });
    }

    if(conc > 2000){
        result.push({
            type: "high",
            level: "轻度",
            text: "RNA浓度较高，注意RT反应上样体积限制",
            suggestion: [
                "稀释后使用，避免超出最大上样体积",
                "确认RT体系中RNA投入量在推荐范围内"
            ]
        });
    }

    return result;

}

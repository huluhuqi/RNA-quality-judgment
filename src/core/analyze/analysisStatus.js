/**
 * 分析状态判断
 *
 * 根据样本输入数据完整程度，判断可以进行哪些分析：
 *   - rtRecommend:         有浓度 → 可推荐RT模板量
 *   - qualityAnalysis:     有A260/280 → 可进行RNA质量判断
 *   - fullPollutionAnalysis: 有A260/280+A260/230 → 完整污染分析
 *   - only280Analysis:     有A260/280但无A260/230 → 仅依据A260/280
 */


/**
 * 判断样本可进行的分析类型
 *
 * @param {Object} sample 标准化样本
 * @returns {Object} 分析状态标志
 */
export function getAnalysisStatus(sample) {

    const hasConcentration = isPresent(sample.concentration);
    const hasA260280 = isPresent(sample.a260280);
    const hasA260230 = isPresent(sample.a260230);

    return {

        /*
         * RT模板推荐：需要浓度
         */
        rtRecommend: hasConcentration,

        /*
         * RNA质量判断：需要A260/280
         */
        qualityAnalysis: hasA260280,

        /*
         * 完整污染分析：需要A260/280 + A260/230
         */
        fullPollutionAnalysis: hasA260280 && hasA260230,

        /*
         * 仅A260/280分析：有280但无230
         */
        only280Analysis: hasA260280 && !hasA260230

    };

}


/**
 * 值是否存在（非null/非空/可转为数字）
 */
function isPresent(value) {

    if (value === null || value === undefined || value === "") {
        return false;
    }

    const num = Number(value);

    return !isNaN(num);

}

/**
 * 提取流程问题统计
 *
 * 遍历所有样本的 advice.extraction，
 * 按污染标题统计出现次数，供总体分析展示。
 *
 * @param {Array} samples  样本数组（含 result.advice.extraction）
 * @returns {Object} { "污染标题": 数量, ... } 按数量降序排列
 */
export function getExtractionStatistics(samples = []){

    const count = {};

    samples
        .filter(item => !item.ignored)
        .forEach(sample => {

            const extraction = sample.result?.advice?.extraction || [];

            extraction.forEach(item => {
                const title = item.title || '未知问题';
                if(!count[title]){
                    count[title] = 0;
                }
                count[title]++;
            });

        });

    return count;

}


/**
 * 将统计结果转为排序后的数组，便于图表使用
 *
 * @param {Object} stats  getExtractionStatistics 返回值
 * @param {number} limit  取前 N 个
 * @returns {Array} [{ name, value }]
 */
export function toExtractionChartData(stats = {}, limit = 10){

    return Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([name, value]) => ({ name, value }));

}

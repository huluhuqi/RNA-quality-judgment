/**
 * 提取流程问题统计
 *
 * 遍历所有样本的 advice.extraction，
 * 按污染标题统计出现次数，供总体分析展示。
 *
 * 第9.11.3后修复：
 *   1. 不再仅依赖 advice.extraction，
 *   2. 对质量差/指标异常但无提取建议的样本，按指标推断风险并统计
 *   3. 避免出现"质量差但提取流程无异常"的矛盾结果
 *
 * @param {Array} samples  样本数组（含 result.advice.extraction）
 * @returns {Object} { "问题标题": 数量, ... }
 */
import { isPoorQuality } from "../../config/qualityLevel";
import { getValidSamples } from "../sample/sampleUtils";


/**
 * 统计提取流程问题
 *
 * @param {Array} samples
 * @returns {Object} { "标题": 数量 }
 */
export function getExtractionStatistics(samples = []){

    const count = {};

    getValidSamples(samples)
        .forEach(sample => {

            const quality = sample.result?.quality;
            const pollution = sample.result?.advice?.pollution || [];
            const extraction = sample.result?.advice?.extraction || [];

            // 1. 优先统计已有提取建议（数据库匹配或兜底生成）
            if(extraction.length){
                extraction.forEach(item => {
                    const name = item.title || '未知问题';
                    count[name] = (count[name] || 0) + 1;
                });
                return;
            }

            // 2. 若无提取建议但样本异常，按指标推断风险
            const isQualityBad = isPoorQuality(quality);
            const hasPollution = pollution.length > 0;

            if(isQualityBad || hasPollution){

                const problems = [];

                const a280 = Number(sample.a260280);
                const a230 = Number(sample.a260230);

                if(!isNaN(a280) && a280 && a280 < 1.8){
                    problems.push("蛋白质/酚类去除不足风险");
                }

                if(!isNaN(a230) && a230 && a230 < 1.8){
                    problems.push("盐类或提取试剂残留风险");
                }

                if(problems.length === 0){
                    problems.push("RNA质量异常，建议检查提取流程");
                }

                problems.forEach(name => {
                    count[name] = (count[name] || 0) + 1;
                });

            }

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

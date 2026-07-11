/**
 * 样本质量统计
 *
 * 统计：
 *   - 总样本数 / 有效样本数 / 忽略样本数 / 待检测数
 *   - 各质量等级数量（优秀/良好/一般/较差/待检测）
 *   - 浓度统计（平均/最小/最大）
 */
import { analyzeRNA } from "../quality";
import { QUALITY_LEVEL, PENDING } from "../../config/qualityLevel";


export function getSampleStatistics(samples, extractionMethod, application){


    const totalCount = samples.length;

    const ignoredSamples = samples.filter(item => item.ignored);
    const activeSamples = samples.filter(item => !item.ignored);
    const ignoredCount = ignoredSamples.length;


    // 分析每个有效样本
    const analysisResults = activeSamples.map(item => ({
        sample: item,
        result: analyzeRNA(item, extractionMethod, application)
    }));


    const pendingSamples = analysisResults.filter(
        item => item.result.quality === PENDING.value
    );

    const testedSamples = analysisResults.filter(
        item => item.result.quality !== PENDING.value
    );


    // 质量等级计数
    const qualityCount = {
        [QUALITY_LEVEL.EXCELLENT.value]: 0,
        [QUALITY_LEVEL.GOOD.value]: 0,
        [QUALITY_LEVEL.WARNING.value]: 0,
        [QUALITY_LEVEL.POOR.value]: 0,
        [QUALITY_LEVEL.FAIL.value]: 0,
        [PENDING.value]: pendingSamples.length
    };

    testedSamples.forEach(item => {
        const q = item.result.quality;
        if(qualityCount[q] !== undefined){
            qualityCount[q]++;
        }
    });


    // 浓度统计
    const concentrations = activeSamples
        .map(item => Number(item.concentration))
        .filter(value => !isNaN(value) && value > 0);

    const avgConcentration = average(concentrations);


    return {
        totalCount,
        validCount: activeSamples.length,
        ignoredCount,
        pendingCount: pendingSamples.length,
        analysisResults,
        testedSamples,
        pendingSamples,
        qualityCount,
        avgConcentration: Number(avgConcentration.toFixed(2)),
        minConcentration: concentrations.length ? Math.min(...concentrations) : 0,
        maxConcentration: concentrations.length ? Math.max(...concentrations) : 0
    };


}


function average(arr){
    if(arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

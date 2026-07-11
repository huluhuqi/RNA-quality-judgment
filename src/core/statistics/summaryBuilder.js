/**
 * 顶部总结生成
 *
 * 生成：
 *   - 总体质量评价（基于优秀率/良好率/较差率）
 *   - 下游应用分析（applicationSummary）
 */
import { downstreamApplications } from "../../config/downstreamApplication";
import { QUALITY_LEVEL, getQualityLabel } from "../../config/qualityLevel";


export function buildSummary(sampleStat, application){


    const qualityCount = sampleStat.qualityCount;
    const qualitySampleCount = sampleStat.testedSamples.length;


    let overallQuality = "暂无数据";

    if(qualitySampleCount > 0){

        const excellentCount = qualityCount[QUALITY_LEVEL.EXCELLENT.value] || 0;
        const goodCount = qualityCount[QUALITY_LEVEL.GOOD.value] || 0;
        const poorCount = qualityCount[QUALITY_LEVEL.POOR.value] || 0;
        const failCount = qualityCount[QUALITY_LEVEL.FAIL.value] || 0;
        const warningCount = qualityCount[QUALITY_LEVEL.WARNING.value] || 0;

        const goodRate = (excellentCount + goodCount) / qualitySampleCount;
        const excellentRate = excellentCount / qualitySampleCount;
        const badRate = (poorCount + failCount) / qualitySampleCount;

        if(excellentRate >= 0.8 && badRate <= 0.05){
            overallQuality = QUALITY_LEVEL.EXCELLENT.value;
        }
        else if(goodRate >= 0.8){
            overallQuality = QUALITY_LEVEL.GOOD.value;
        }
        else if(badRate >= 0.3){
            overallQuality = QUALITY_LEVEL.POOR.value;
        }
        else{
            overallQuality = QUALITY_LEVEL.WARNING.value;
        }

    }


    // 下游应用分析
    const appConfig = downstreamApplications[application] || downstreamApplications.qPCR;

    const applicationSummary = {
        name: appConfig.name,
        qualityLevel: appConfig.qualityLevel,
        requirements: appConfig.requirements,
        goodCount: (qualityCount[QUALITY_LEVEL.EXCELLENT.value] || 0) + (qualityCount[QUALITY_LEVEL.GOOD.value] || 0),
        warningCount: (qualityCount[QUALITY_LEVEL.WARNING.value] || 0) + (qualityCount[QUALITY_LEVEL.POOR.value] || 0) + (qualityCount[QUALITY_LEVEL.FAIL.value] || 0),
        total: qualitySampleCount
    };


    return {
        quality: overallQuality,
        applicationSummary
    };


}

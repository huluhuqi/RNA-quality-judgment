/**
 * 顶部总结生成
 *
 * 生成：
 *   - 总体质量评价（基于优秀率/良好率/较差率）
 *   - 下游应用分析（applicationSummary）
 */
import { downstreamApplications } from "../../config/downstreamApplication";


export function buildSummary(sampleStat, application){


    const qualityCount = sampleStat.qualityCount;
    const qualitySampleCount = sampleStat.testedSamples.length;


    let overallQuality = "暂无数据";

    if(qualitySampleCount > 0){

        const goodRate = (qualityCount.优秀 + qualityCount.良好) / qualitySampleCount;
        const excellentRate = qualityCount.优秀 / qualitySampleCount;
        const badRate = qualityCount.较差 / qualitySampleCount;

        if(excellentRate >= 0.8 && badRate <= 0.05){
            overallQuality = "优秀";
        }
        else if(goodRate >= 0.8){
            overallQuality = "良好";
        }
        else if(badRate >= 0.3){
            overallQuality = "较差";
        }
        else{
            overallQuality = "一般";
        }

    }


    // 下游应用分析
    const appConfig = downstreamApplications[application] || downstreamApplications.qPCR;

    const applicationSummary = {
        name: appConfig.name,
        qualityLevel: appConfig.qualityLevel,
        requirements: appConfig.requirements,
        goodCount: qualityCount.优秀 + qualityCount.良好,
        warningCount: qualityCount.一般 + qualityCount.较差,
        total: qualitySampleCount
    };


    return {
        quality: overallQuality,
        applicationSummary
    };


}

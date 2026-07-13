/**
 * RNA质量分析统一入口
 *
 * 输出结构：
 *   { quality, qualityScore, qualityDetail, pollution, suggestion, pollutionType, diagnosis }
 *
 * 保持原函数签名 analyzeRNA(sample, extractionMethod, application)，
 * 调用方无需修改。
 */
import { judgeQuality, analyzeQuality } from "./qualityJudge";
import { judgePollution } from "./pollutionJudge";
import { buildSuggestion } from "./suggestionBuilder";


export function analyzeRNA(sample, extractionMethod, application){


    const qualityResult = analyzeQuality(sample, application);


    const pollution = judgePollution(sample, extractionMethod);


    const suggestion = buildSuggestion(
        qualityResult.quality,
        pollution,
        application,
        extractionMethod
    );


    return {
        quality: qualityResult.quality,
        qualityScore: qualityResult.score,
        qualityDetail: qualityResult.detail,
        riskMessage: qualityResult.riskMessage,
        pollution: pollution.pollutionText,
        suggestion,
        pollutionType: pollution.pollutionType,
        diagnosis: pollution.diagnosis
    };


}

/**
 * RNA质量分析统一入口
 *
 * 输出结构与原 RNAQuality.js 完全一致：
 *   { quality, pollution, suggestion, pollutionType, diagnosis }
 *
 * 保持原函数签名 analyzeRNA(sample, extractionMethod, application)，
 * 调用方无需修改。
 */
import { judgeQuality } from "./qualityJudge";
import { judgePollution } from "./pollutionJudge";
import { buildSuggestion } from "./suggestionBuilder";


export function analyzeRNA(sample, extractionMethod, application){


    const quality = judgeQuality(sample, application);


    const pollution = judgePollution(sample, extractionMethod);


    const suggestion = buildSuggestion(
        quality,
        pollution,
        application,
        extractionMethod
    );


    return {
        quality,
        pollution: pollution.pollutionText,
        suggestion,
        pollutionType: pollution.pollutionType,
        diagnosis: pollution.diagnosis
    };


}

import { analyzeRNAQuality } from "./qualityAnalyzer";
import { analyzePollution } from "./pollutionAnalyzer";
import { generateExtractionAdvice } from "./extractionAdvisor";
import { evaluateApplication } from "./applicationAdvisor";
import { calculateRT } from "./rt/rtCalculator";
import { generateRTAdvice } from "./rt/rtAdvisor";
import { getAnalysisCache, setAnalysisCache } from "./cache";

export function analyzeSample(sample) {
    const cacheData = getAnalysisCache(sample.id);
    if (cacheData) {
        return cacheData;
    }

    const raw = sample.raw || sample;
    const experiment = sample.experiment || {};
    const method = experiment.extraction?.method || "column";
    const purpose = experiment.application?.purpose || "qpcr";

    const quality = analyzeRNAQuality(raw);
    const pollution = analyzePollution(raw);

    const extractionAdvice = generateExtractionAdvice(method, pollution);
    const applicationAdvice = evaluateApplication(quality, purpose);

    const rtResult = calculateRT(raw.concentration);

    const result = {
        quality,
        pollution,
        advice: {
            extraction: extractionAdvice,
            experiment: applicationAdvice
        },
        rt: {
            ...rtResult,
            recommendation: generateRTAdvice(rtResult)
        }
    };

    setAnalysisCache(sample.id, result);
    return result;
}
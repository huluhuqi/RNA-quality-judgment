import { getValidSamples } from "../sample/sampleUtils";
import { getQualityLabel } from "../../config/qualityLevel";
import { getContaminationDisplay } from "../../config/contaminationMapping";
import {
    formatPollutionText,
    formatExtractionProblemText,
    formatExtractionSuggestionText
} from "./formatReportData";

export function createReportModel(data) {
    const { samples = [], summary = {}, settings = {}, charts = {} } = data;
    
    return {
        experimentInfo: {
            name: settings.name || summary.name || "",
            date: settings.date || summary.date || "",
            operator: settings.operator || summary.operator || "",
            extractionMethod: settings.method || summary.extractionMethod || ""
        },
        
        parameters: {
            extractionMethod: settings.method || summary.extractionMethod || "",
            rt: settings.rt || summary.rt || {}
        },
        
        samples: getValidSamples(samples).map(sample => {
            const result = sample.result || {};
            const analysis = sample.analysis || {};
            const advice = result.advice || analysis.advice || {};
            const raw = sample.raw || sample;
            
            return {
                templateId: raw.templateId || sample.templateId || "",
                concentration: raw.concentration ?? "",
                a260280: raw.a260280 ?? "",
                a260230: raw.a260230 ?? "",
                quality: analysis.quality?.level ? getQualityLabel(analysis.quality.level) : 
                         (result.quality ? getQualityLabel(result.quality) : "未判断"),
                pollution: analysis.pollution?.description || formatPollutionText(advice.pollution),
                extractionProblem: formatExtractionProblemText(advice.extractionProblem),
                suggestion: analysis.advice?.experiment || formatExtractionSuggestionText(advice.extractionProblem),
                qualityScore: analysis.quality?.score ?? result.qualityScore ?? "",
                diagnosis: analysis.quality?.reason ?? result.diagnosis ?? ""
            };
        }),
        
        summary: {
            total: summary.totalCount || summary.total || 0,
            valid: summary.validCount || 0,
            ignored: summary.ignoredCount || 0,
            conclusion: summary.conclusion || "",
            avgConcentration: summary.avgConcentration || 0,
            quality: summary.quality ? getQualityLabel(summary.quality) : "待检测",
            qualityCount: summary.qualityCount || {},
            pollutionCount: summary.pollutionCount || {},
            extractionCount: summary.extractionCount || {},
            pollutionSamples: summary.pollutionSamples || [],
            extractionSummaryText: summary.extractionSummaryText || ""
        },
        
        charts: {
            quality: charts.quality || null,
            pollution: charts.pollution || null,
            extraction: charts.extraction || null
        }
    };
}

export function formatPollution(pollution = []) {
    return pollution.map(item => {
        const displayName = getContaminationDisplay(item.type) || item.type;
        return `${displayName}: ${item.reason || item.text || ""}`;
    }).join("\n");
}

export function formatAdvice(advice = []) {
    if (Array.isArray(advice)) {
        return advice.join("\n");
    }
    return "";
}

export function getAbnormalSamples(samples) {
    return samples.filter(sample => {
        const quality = sample.analysis?.quality?.level || sample.result?.quality;
        return quality === 'poor' || quality === 'fail';
    });
}
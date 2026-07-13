import { getActiveSamples } from "@/utils/sampleFilter";

export function buildReport(data) {
    const activeSamples = getActiveSamples(data.samples || []);

    return {
        title: "RNA质量分析实验报告",
        experiment: data.experiment,
        summary: {
            total: (data.samples || []).length,
            active: activeSamples.length,
            ignored: (data.samples || []).length - activeSamples.length,
            ...data.summary
        },
        samples: activeSamples.map(s => ({
            id: s.raw?.templateId || s.templateId,
            concentration: s.raw?.concentration || s.concentration,
            a260280: s.raw?.a260280 || s.a260280,
            a260230: s.raw?.a260230 || s.a260230,
            quality: s.analysis?.quality || s.quality,
            pollution: s.analysis?.pollution || s.pollution,
            advice: s.analysis?.advice || s.advice,
            rt: s.rt
        }))
    };
}
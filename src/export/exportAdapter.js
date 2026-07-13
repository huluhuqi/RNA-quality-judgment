import { getActiveSamples } from "@/utils/sampleFilter";

export function createExportData(samples, experiment) {
    const activeSamples = getActiveSamples(samples);

    return {
        allSamples: samples,
        samples: activeSamples.map(sample => ({
            id: sample.id,
            templateId: sample.raw.templateId,
            concentration: sample.raw.concentration,
            a260280: sample.raw.a260280,
            a260230: sample.raw.a260230,
            quality: sample.analysis?.quality,
            pollution: sample.analysis?.pollution,
            advice: sample.analysis?.advice,
            rt: sample.rtConfig || sample.rt
        })),
        summary: {
            total: samples.length,
            active: activeSamples.length,
            ignored: samples.length - activeSamples.length
        },
        experiment
    };
}
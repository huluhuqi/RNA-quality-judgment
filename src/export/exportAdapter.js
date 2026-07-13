export function createExportData(samples, experiment) {
    return {
        samples: samples.map(sample => ({
            id: sample.id,
            templateId: sample.raw.templateId,
            concentration: sample.raw.concentration,
            a260280: sample.raw.a260280,
            a260230: sample.raw.a260230,
            quality: sample.analysis?.quality,
            pollution: sample.analysis?.pollution,
            advice: sample.analysis?.advice,
            rt: sample.rt
        })),
        experiment
    };
}
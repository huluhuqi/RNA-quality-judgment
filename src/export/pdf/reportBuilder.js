export function buildReport(data) {
    return {
        title: "RNA质量分析实验报告",
        experiment: data.experiment,
        summary: data.summary,
        samples: data.samples.map(s => ({
            id: s.templateId,
            quality: s.quality,
            pollution: s.pollution,
            advice: s.advice,
            rt: s.rt
        }))
    };
}
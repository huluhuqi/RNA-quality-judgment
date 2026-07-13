export function exportSampleRows(samples) {
    return samples.map(sample => ({
        模板ID: sample.raw?.templateId || sample.templateId || "",
        RNA浓度: sample.raw?.concentration ?? sample.concentration ?? "",
        A260/A280: sample.raw?.a260280 ?? sample.a260280 ?? "",
        A260/A230: sample.raw?.a260230 ?? sample.a260230 ?? "",
        RNA质量: sample.analysis?.quality?.level || sample.result?.quality || "",
        污染分析: sample.analysis?.pollution?.description || sample.result?.pollution || "",
        提取建议: (sample.analysis?.advice?.extraction || []).join("; ") || "",
        下游实验建议: (sample.analysis?.advice?.experiment || []).join("; ") || sample.result?.suggestion || "",
        RT状态: sample.analysis?.rt?.status || "",
        RT模板加入体积: sample.analysis?.rt?.inputVolume || "",
        RT建议: sample.analysis?.rt?.recommendation || ""
    }));
}
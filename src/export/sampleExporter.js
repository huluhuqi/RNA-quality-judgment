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
        推荐RNA量: sample.rt?.targetRNA || "",
        RNA模板体积: sample.rt?.templateVolume !== null && sample.rt?.templateVolume !== undefined ? sample.rt.templateVolume + " μL" : "无法计算",
        最大模板体积: (sample.rt?.maxTemplateVolume ?? 12) + " μL",
        RT补水体积: sample.rt?.waterVolume !== null && sample.rt?.waterVolume !== undefined ? sample.rt.waterVolume + " μL" : "无法配置",
        RT状态: sample.rt?.statusText || "",
        RT建议: sample.rt?.suggestion || "",
        最低推荐浓度: sample.rt?.requiredConcentration !== null && sample.rt?.requiredConcentration !== undefined ? sample.rt.requiredConcentration + " ng/μL" : ""
    }));
}

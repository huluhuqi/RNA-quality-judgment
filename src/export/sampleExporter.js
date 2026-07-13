function getRT(sample) {
    return sample?.rtConfig || sample?.rt || {};
}

export function exportSampleRows(samples) {
    return samples.map(sample => {
        const rt = getRT(sample);
        return {
            模板ID: sample.raw?.templateId || sample.templateId || "",
            RNA浓度: sample.raw?.concentration ?? sample.concentration ?? "",
            A260/A280: sample.raw?.a260280 ?? sample.a260280 ?? "",
            A260/A230: sample.raw?.a260230 ?? sample.a260230 ?? "",
            RNA质量: sample.analysis?.quality?.level || sample.result?.quality || "",
            污染分析: sample.analysis?.pollution?.description || sample.result?.pollution || "",
            提取建议: (sample.analysis?.advice?.extraction || []).join("; ") || "",
            实验建议: (sample.analysis?.advice?.experiment || []).join("; ") || sample.result?.suggestion || "",
            RNA投入量: rt.targetRNA || "",
            RNA模板体积: rt.templateVolume !== null && rt.templateVolume !== undefined ? rt.templateVolume + " μL" : "无法配置",
            最大模板体积: (rt.maxTemplateVolume ?? 12) + " μL",
            RT补水体积: rt.waterVolume !== null && rt.waterVolume !== undefined ? rt.waterVolume + " μL" : "无法配置",
            RT状态: rt.statusText || "",
            RT建议: rt.suggestion || "",
            最低推荐浓度: rt.requiredConcentration !== null && rt.requiredConcentration !== undefined ? rt.requiredConcentration + " ng/μL" : ""
        };
    });
}

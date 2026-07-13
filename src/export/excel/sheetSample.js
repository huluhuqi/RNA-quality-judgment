export function createSampleSheet(samples) {
    return samples.map(s => ({
        模板ID: s.templateId,
        RNA浓度: s.concentration ?? "",
        A260_A280: s.a260280 ?? "",
        A260_A230: s.a260230 ?? "",
        RNA质量: s.quality?.level || "",
        质量原因: s.quality?.reason?.join(";") || "",
        污染分析: s.pollution?.description || "",
        污染类型: s.pollution?.types?.join(";") || "",
        提取建议: s.advice?.extraction ? JSON.stringify(s.advice.extraction) : "",
        下游实验建议: s.advice?.experiment || "",
        推荐RNA量: s.rt?.targetRNA || "",
        RNA模板体积: s.rt?.templateVolume !== null && s.rt?.templateVolume !== undefined ? s.rt.templateVolume + " μL" : "无法计算",
        最大模板体积: (s.rt?.maxTemplateVolume ?? 12) + " μL",
        RT补水体积: s.rt?.waterVolume !== null && s.rt?.waterVolume !== undefined ? s.rt.waterVolume + " μL" : "无法计算",
        RT状态: s.rt?.status || ""
    }));
}
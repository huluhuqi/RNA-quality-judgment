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
        RT状态: s.rt?.status || "",
        RT模板量: s.rt?.inputVolume || "",
        RT建议: s.rt?.recommendation || ""
    }));
}
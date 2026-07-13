import { safeValue } from "@/utils/safeValue";

export function createSampleSheet(samples) {
    return samples.map(s => ({
        模板ID: safeValue(s.templateId),
        RNA浓度: safeValue(s.concentration),
        A260_A280: safeValue(s.a260280),
        A260_A230: safeValue(s.a260230),
        RNA质量: safeValue(s.quality?.level),
        质量原因: safeValue((s.quality?.reason || []).join(";")),
        污染分析: safeValue(s.pollution?.description),
        污染类型: safeValue((s.pollution?.types || []).join(";")),
        提取建议: safeValue(s.advice?.extraction ? JSON.stringify(s.advice.extraction) : ""),
        实验建议: safeValue(s.advice?.experiment),
        RNA投入量: safeValue(s.rt?.targetRNA),
        RNA模板体积: s.rt?.templateVolume !== null && s.rt?.templateVolume !== undefined
            ? s.rt.templateVolume + " μL"
            : "无法配置",
        最大模板体积: safeValue(s.rt?.maxTemplateVolume, 12) + " μL",
        RT补水体积: s.rt?.waterVolume !== null && s.rt?.waterVolume !== undefined
            ? s.rt.waterVolume + " μL"
            : "无法配置",
        RT状态: safeValue(s.rt?.statusText),
        RT建议: safeValue(s.rt?.suggestion),
        最低推荐浓度: s.rt?.requiredConcentration !== null && s.rt?.requiredConcentration !== undefined
            ? s.rt.requiredConcentration + " ng/μL"
            : ""
    }));
}

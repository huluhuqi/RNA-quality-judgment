import { safeValue } from "@/utils/safeValue";

/**
 * 将提取建议数组格式化为可读文本
 *
 * 输入: [{ problem: "标题", steps: ["建议1", "建议2"] }]
 * 输出: "标题\n- 建议1\n- 建议2"
 */
function formatExtractionForExcel(extraction) {
    if (!extraction || !Array.isArray(extraction) || extraction.length === 0) return "";
    return extraction.map(item => {
        const problem = item.problem || "";
        const steps = (item.steps || []).join("；");
        return steps ? `${problem}：${steps}` : problem;
    }).join("\n");
}

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
        提取建议: formatExtractionForExcel(s.advice?.extraction),
        实验建议: safeValue(s.advice?.experiment),
        RNA投入量: safeValue(s.rt?.targetRNA),
        RT模板体积: s.rt?.templateVolume !== null && s.rt?.templateVolume !== undefined
            ? s.rt.templateVolume + " μL"
            : "无法配置",
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

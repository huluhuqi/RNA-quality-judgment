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

function getRT(s) {
    return s?.rtConfig || s?.rt || {};
}

export function createSampleSheet(samples) {
    return samples.map(s => {
        const rt = getRT(s);
        return {
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
            RNA投入量: safeValue(rt.targetRNA),
            RT模板体积: rt.templateVolume !== null && rt.templateVolume !== undefined
                ? rt.templateVolume + " μL"
                : "无法配置",
            RT补水体积: rt.waterVolume !== null && rt.waterVolume !== undefined
                ? rt.waterVolume + " μL"
                : "无法配置",
            RT状态: safeValue(rt.statusText),
            RT建议: safeValue(rt.suggestion),
            最低推荐浓度: rt.requiredConcentration !== null && rt.requiredConcentration !== undefined
                ? rt.requiredConcentration + " ng/μL"
                : ""
        };
    });
}

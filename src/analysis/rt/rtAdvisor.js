export function generateRTAdvice(rtResult) {
    if (!rtResult || rtResult.status === "无法计算") {
        return rtResult?.message || "缺少RNA浓度数据，请补充浓度后计算RT模板量";
    }

    switch (rtResult.status) {
        case "推荐":
            return `RNA浓度适宜。建议加入RNA模板 ${rtResult.inputVolume} μL，目标RNA投入量约 ${rtResult.rnaAmount} ng。`;

        case "浓度不足":
            return `RNA浓度较低。当前最大加入体积：${rtResult.inputVolume} μL。建议：1. 提高RNA浓度；2. RNA纯化浓缩后重新检测；3. 或降低RT模板投入量。`;

        case "需要稀释":
            return `RNA浓度较高。建议：对RNA进行适当稀释，避免小体积移液误差影响RT重复性。`;

        default:
            return rtResult.message || "";
    }
}
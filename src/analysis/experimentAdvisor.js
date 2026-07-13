export function generateExperimentAdvice(quality, pollution) {
    const result = [];

    if (quality.level === "不合格") {
        result.push("建议RNA纯化后重新检测，再进行反转录");
    } else if (quality.level === "需关注") {
        result.push("建议评估实验需求，必要时进行纯化处理");
    } else {
        result.push("RNA质量满足大部分下游实验需求");
    }

    if (pollution.severity === "异常") {
        result.push("污染风险可能影响RT效率及qPCR稳定性");
    }

    return result;
}
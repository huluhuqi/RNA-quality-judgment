import { extractionRules } from "./extractionRules";

export function generateExtractionAdvice(method, pollution) {
    const rule = extractionRules[method];

    if (!rule) {
        return [{
            problem: "未知提取方法",
            steps: ["请检查RNA提取流程"]
        }];
    }

    const result = [];

    pollution.types.forEach(type => {
        const advice = rule.pollution[type];
        if (advice) {
            result.push({
                problem: type,
                steps: advice
            });
        }
    });

    if (result.length === 0) {
        result.push({
            problem: "未发现明显污染",
            steps: ["当前提取流程未见明显异常"]
        });
    }

    return result;
}
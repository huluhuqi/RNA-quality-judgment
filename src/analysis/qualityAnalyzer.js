export function analyzeRNAQuality(raw) {
    const result = {
        level: "合格",
        score: 100,
        reason: []
    };

    if (raw.a260280 === null || raw.a260280 === undefined || raw.a260280 === "") {
        return {
            level: "待检测",
            score: null,
            reason: ["缺少A260/A280数据，无法判断RNA纯度"]
        };
    }

    const ratio280 = Number(raw.a260280);

    if (ratio280 < 1.7) {
        result.level = "不合格";
        result.score -= 40;
        result.reason.push("A260/A280偏低，提示蛋白质或酚类污染风险");
    } else if (ratio280 < 1.8) {
        result.level = "需关注";
        result.score -= 20;
        result.reason.push("A260/A280略低，建议关注纯化过程");
    } else if (ratio280 > 2.1) {
        result.level = "需关注";
        result.score -= 15;
        result.reason.push("A260/A280偏高，可能存在RNA降解或测定偏差");
    }

    if (raw.a260230 !== null && raw.a260230 !== undefined && raw.a260230 !== "") {
        const ratio230 = Number(raw.a260230);

        if (ratio230 < 0.8) {
            result.level = "不合格";
            result.score -= 40;
            result.reason.push("A260/A230严重偏低，提示胍盐、盐类或提取试剂残留");
        } else if (ratio230 < 1.8) {
            result.level = "需关注";
            result.score -= 20;
            result.reason.push("A260/A230偏低，提示洗涤或纯化不足");
        }
    }

    return result;
}
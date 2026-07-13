export function classifyRNAConcentration(concentration) {
    if (concentration === null || concentration === undefined || concentration === "") {
        return {
            level: "unknown",
            message: "缺少RNA浓度，无法计算RT模板投入量"
        };
    }

    const c = Number(concentration);

    if (isNaN(c) || c <= 0) {
        return {
            level: "unknown",
            message: "RNA浓度数据异常，无法计算RT模板投入量"
        };
    }

    if (c < 5) {
        return {
            level: "low",
            message: "RNA浓度偏低"
        };
    }

    if (c <= 100) {
        return {
            level: "normal",
            message: "RNA浓度适合RT反应"
        };
    }

    return {
        level: "high",
        message: "RNA浓度较高，建议稀释后使用"
    };
}
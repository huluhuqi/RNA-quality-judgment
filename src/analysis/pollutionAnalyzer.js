export function analyzePollution(raw) {
    const result = {
        types: [],
        description: "",
        severity: "正常"
    };

    if (raw.a260280 && Number(raw.a260280) < 1.8) {
        result.types.push("蛋白质/酚类污染");
        result.description += "A260/A280偏低，提示蛋白质或酚类残留；";
    }

    if (raw.a260230 !== null && raw.a260230 !== "") {
        const r = Number(raw.a260230);

        if (r < 1.8) {
            result.types.push("盐类/胍盐/试剂残留");
            result.description += "A260/A230偏低，提示胍盐、盐类或提取试剂残留；";
        }
    } else {
        result.description += "未提供A260/A230，仅根据A260/A280判断污染风险；";
    }

    if (result.types.length) {
        result.severity = "异常";
    } else {
        result.description = "未发现明显污染指标异常";
    }

    return result;
}
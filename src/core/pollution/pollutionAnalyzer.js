import {
    POLLUTION_TYPE
} from "../../config/pollutionTypes";
import { getNumber, isPresent } from "../sample/sampleUtils";

export function analyzePollution(sample) {

    const result = [];

    const a280 = getNumber(sample.a260280);
    const has230 = isPresent(sample.a260230);
    const a230 = getNumber(sample.a260230);

    // ======================
    // A260/280分析
    // ======================
    if (!isNaN(a280)) {

        if (a280 < 1.8) {

            result.push({
                type: POLLUTION_TYPE.PROTEIN.name,
                level: "high",
                reason: `A260/280=${a280.toFixed(2)}，低于正常范围(1.8-2.2)，提示蛋白质或酚类污染风险`
            });

        } else if (a280 > 2.1) {

            result.push({
                type: "可能存在RNA降解",
                level: "medium",
                reason: `A260/280=${a280.toFixed(2)}，偏高，可能存在RNA降解或检测偏差`
            });

        }

    }

    // ======================
    // A260/230分析
    // ======================
    if (has230) {

        if (a230 < 1.5) {

            result.push({
                type: POLLUTION_TYPE.SALT.name,
                level: "high",
                reason: `A260/230=${a230.toFixed(2)}，明显偏低，提示胍盐、盐类或提取试剂残留风险`
            });

        } else if (a230 < 1.8) {

            result.push({
                type: POLLUTION_TYPE.REAGENT.name,
                level: "medium",
                reason: `A260/230=${a230.toFixed(2)}，轻度偏低，可能存在残留污染`
            });

        }

    } else {

        result.push({
            type: "未检测A260/230",
            level: "info",
            reason: "未提供A260/230数据，仅根据A260/280进行污染判断"
        });

    }

    if (result.length === 0) {

        result.push({
            type: POLLUTION_TYPE.NONE.name,
            level: "normal",
            reason: "未发现明显污染风险"
        });

    }

    return result;

}

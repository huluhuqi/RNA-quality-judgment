import {
    POLLUTION_TYPE
} from "../../config/pollutionTypes";
import { getNumber, isPresent } from "../sample/sampleUtils";

function getRaw(sample) {
    return sample.raw || sample;
}

/**
 * 分析样本污染情况
 *
 * 适配新 Sample 结构：从 sample.raw.a260280 / sample.raw.a260230 读取
 * 兼容旧结构：从 sample.a260280 / sample.a260230 读取
 *
 * A260/230 缺失时：
 *   - 仅根据 A260/280 进行基础纯度判断
 *   - 不误判为盐类污染
 */
export function analyzePollution(sample) {

    const raw = getRaw(sample);
    const result = [];

    const a280 = getNumber(raw.a260280);
    const has230 = isPresent(raw.a260230);
    const a230 = getNumber(raw.a260230);

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

        // A260/230 缺失：仅根据 A260/280 判断
        // 不误判为盐类污染
        if (a280 < 1.8) {
            result.push({
                type: "缺少A260/230数据",
                level: "info",
                reason: "缺少A260/230数据，仅根据A260/280判断，存在蛋白污染风险，盐类残留无法判断"
            });
        } else {
            result.push({
                type: "缺少A260/230数据",
                level: "info",
                reason: "缺少A260/230数据，仅完成基础纯度判断，盐类残留情况未知"
            });
        }

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

/**
 * 仅基于 A260/280 的污染分析（A260/230 缺失时使用）
 *
 * @deprecated 直接使用 analyzePollution 即可，内部已自动处理缺失情况
 */
export function analyzeWithout230(sample) {
    const raw = getRaw(sample);
    const result = [];

    const a280 = getNumber(raw.a260280);

    if (!isNaN(a280) && a280 < 1.8) {
        result.push("蛋白质或酚类污染风险");
    }

    return {
        types: result,
        description: result.length
            ? "根据A260/280判断，存在蛋白污染风险"
            : "缺少A260/230，仅完成基础纯度判断"
    };
}
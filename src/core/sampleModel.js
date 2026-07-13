/**
 * RNA样本数据模型
 *
 * 所有输入数据统一经过这里，保证字段一致：
 * id, concentration, a260280, a260230, ignored, result
 *
 * 兼容旧字段：a280/a230/A260_280/A260_230
 */
import { normalizeQuality } from "../config/qualityLevel";


/**
 * 创建标准化样本对象
 */
export function createSample(data = {}){


    const result = data.result
        ? {
            ...data.result,
            quality: data.result.quality ? normalizeQuality(data.result.quality) : ""
        }
        : {
            quality: "",
            pollution: {
                protein: false,
                salt: false
            },
            pollutionText: "",
            suggestion: ""
        };


    return {


        /*
        =================
        基础数据
        =================
        */

        id:
            String(data.id ?? ""),


        // 空值保留 null，不转为0，避免质量判断将"未检测"误判为"0值不合格"
        concentration:
            toNullableNumber(data.concentration),


        // 兼容旧字段 a280 / A260_280
        a260280:
            toNullableNumber(
                data.a260280
                ?? data.a280
                ?? data.A260_280
            ),


        // 兼容旧字段 a230 / A260_230
        a260230:
            toNullableNumber(
                data.a260230
                ?? data.a230
                ?? data.A260_230
            ),


        /*
        =================
        状态
        =================
        */

        ignored:
            Boolean(data.ignored),


        /*
        =================
        分析结果（由 RNAQuality 填充）
        =================
        */

        result


    }


}


/**
 * 批量标准化
 */
export function normalizeSamples(samples = []){


    return samples.map(
        item => createSample(item)
    )


}


/**
 * 空值保留 null，有效值转 Number
 *
 * null/undefined/"" → null
 * 数字/数字字符串 → Number
 */
function toNullableNumber(value) {

    if (value === null || value === undefined || value === "") {
        return null;
    }

    const num = Number(value);

    return isNaN(num) ? null : num;

}

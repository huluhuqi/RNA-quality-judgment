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


        concentration:
            Number(data.concentration ?? 0),


        // 兼容旧字段 a280 / A260_280
        a260280:
            Number(
                data.a260280
                ?? data.a280
                ?? data.A260_280
                ?? 0
            ),


        // 兼容旧字段 a230 / A260_230
        a260230:
            Number(
                data.a260230
                ?? data.a230
                ?? data.A260_230
                ?? 0
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

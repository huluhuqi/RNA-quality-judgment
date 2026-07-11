/**
 * 导出数据格式化
 *
 * 统一读取 sample.result，保证 Excel / PDF / 页面三者一致。
 * 若 sample.result 未填充（兼容旧数据），回退到 analyzeRNA。
 */
import { analyzeRNA } from "../../core/quality";


export function formatSamplesForExport(samples, method, application){


    return samples

        .filter(item => !item.ignored)

        .map(item => {

            // 优先读取已填充的 result；未填充则实时分析（兼容）
            const result = item.result || analyzeRNA(item, method, application);

            return {
                id: item.id,
                concentration: item.concentration,
                a260280: item.a260280,
                a260230: item.a260230,
                quality: result.quality || "无法判断",
                pollution: result.pollution || "",
                suggestion: result.suggestion || ""
            };

        });


}

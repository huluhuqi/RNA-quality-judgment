/**
 * 导出数据一致性检查
 *
 * 导出前校验样本是否已完成分析（sample.result 已填充）。
 * 仅用于开发期警告，不阻断导出流程。
 */

import { isIgnored } from "../sampleFilter";

/**
 * 检查样本是否全部完成分析
 *
 * @param {Array} samples 样本数组
 * @returns {boolean} true 表示所有有效样本均已分析
 */
export function checkExportData(samples = []){


    return samples
        .filter(item => !isIgnored(item))
        .every(item => {
            return item.result && item.result.quality;
        });

}

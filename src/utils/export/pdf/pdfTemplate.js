/**
 * PDF 数据模板
 *
 * 整理传入数据，供 PDF 导出使用。
 * 当前 PDF 通过截图 #pdf-report 区域生成，
 * 此函数用于数据校验与结构化，便于后续扩展（如直接绘制PDF）。
 */

import { getValidSamples } from "../../../core/sample/sampleUtils";

/**
 * 整理 PDF 导出数据
 *
 * @param {Object} data 原始数据 { samples, summary, settings }
 * @returns {Object} 结构化 PDF 数据
 */
export function createPDFData(data = {}){


    return {
        title: "RNA质量检测实验报告",
        experiment: data.settings || {},
        summary: data.summary || {},
        samples: getValidSamples(data.samples || [])
    };

}

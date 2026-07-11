/**
 * Excel 导出入口
 *
 * 数据流：
 *   sample.result → formatSamples → createSampleSheet
 *   summary + charts → createSummarySheet
 *
 * 不重新计算 RNA 质量，直接读取 sample.result，
 * 保证 Excel 与页面显示完全一致。
 *
 * 第9.11.3步：传递提取方法、extraction 图表、批次总结。
 */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { formatSamples, formatSummary } from "../formatExportData";
import { createSampleSheet } from "./createSampleSheet";
import { createSummarySheet } from "./createSummarySheet";
import { checkExportData } from "../checkExportData";
import { generateBatchExtractionSummary } from "../../../core/advice/batchExtractionSummary";


export async function exportExcel(data, charts){


    const { samples, summary, settings } = data;

    // 一致性检查：未分析样本仅警告，不阻断导出
    if(!checkExportData(samples)){
        console.warn("存在未分析样本，导出数据可能不完整");
    }


    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RNA质量检测工具";
    workbook.created = new Date();


    // 提取方法（来自 RT 参数 settings.method）
    const extractionMethod = settings?.method || "";

    // 格式化样本数据（读取 sample.result，不重新分析）
    const formattedSamples = formatSamples(samples, extractionMethod);

    // 格式化总结数据 + 追加批次提取总结文本
    const formattedSummary = formatSummary(summary);
    const badCount = (formattedSummary.qualityCount?.较差 || 0) +
                     (formattedSummary.qualityCount?.不合格 || 0);
    formattedSummary.extractionSummaryText = generateBatchExtractionSummary(
        formattedSummary.extractionCount,
        formattedSummary.validCount,
        badCount
    );


    // Sheet1 样本数据
    createSampleSheet(workbook, formattedSamples);

    // Sheet2 总结报告
    createSummarySheet(workbook, formattedSummary, settings, charts);


    // 导出
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer], {
            type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        "RNA质量检测报告.xlsx"
    );


}

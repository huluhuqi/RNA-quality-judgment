/**
 * Excel 导出入口
 *
 * 数据流：
 *   sample.result → formatSamples → createSampleSheet
 *   summary + charts → createSummarySheet
 *
 * 不重新计算 RNA 质量，直接读取 sample.result，
 * 保证 Excel 与页面显示完全一致。
 */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { formatSamples, formatSummary } from "../formatExportData";
import { createSampleSheet } from "./createSampleSheet";
import { createSummarySheet } from "./createSummarySheet";
import { checkExportData } from "../checkExportData";


export async function exportExcel(data, charts){


    const { samples, summary, settings } = data;

    // 一致性检查：未分析样本仅警告，不阻断导出
    if(!checkExportData(samples)){
        console.warn("存在未分析样本，导出数据可能不完整");
    }


    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RNA质量检测工具";
    workbook.created = new Date();


    // 格式化样本数据（读取 sample.result，不重新分析）
    const formattedSamples = formatSamples(samples);

    // 格式化总结数据
    const formattedSummary = formatSummary(summary);


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

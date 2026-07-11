/**
 * Excel 导出入口
 *
 * 数据流：
 *   sample.result → formatSamplesForExport → createSampleSheet
 *   summary + charts → createSummarySheet
 */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { formatSamplesForExport } from "../formatExportData";
import { createSampleSheet, createSummarySheet } from "./excelContent";


export async function exportExcel(data, charts){


    const { samples, summary, settings } = data;

    const method = settings?.method || '硅胶膜柱提法';
    const application = settings?.application || 'qPCR';


    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RNA质量检测工具";
    workbook.created = new Date();


    // 格式化样本数据（读取 sample.result，不重新分析）
    const formattedSamples = formatSamplesForExport(samples, method, application);


    // Sheet1 样本数据
    createSampleSheet(workbook, formattedSamples);


    // Sheet2 总结报告
    createSummarySheet(workbook, summary, settings, charts);


    // 导出
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer], {
            type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        "RNA质量检测报告.xlsx"
    );


}

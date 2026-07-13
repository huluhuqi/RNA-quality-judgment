import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createSampleSheet } from "./sheetSample";
import { createSummarySheet } from "./sheetSummary";

export function exportExcel(data) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "RNA质量检测工具";
    workbook.created = new Date();

    const samplesSheet = workbook.addWorksheet("样本数据");
    const samplesData = createSampleSheet(data.samples);
    
    if (samplesData.length > 0) {
        const headers = Object.keys(samplesData[0]);
        samplesSheet.columns = headers.map(header => ({
            header,
            key: header,
            width: getColumnWidth(header)
        }));
        
        samplesData.forEach(row => {
            samplesSheet.addRow(row);
        });
    }

    const summarySheet = workbook.addWorksheet("总结");
    const summaryData = createSummarySheet(data.experiment, data.summary);
    
    summarySheet.columns = [
        { width: 20 },
        { width: 30 }
    ];
    
    summaryData.forEach(row => {
        summarySheet.addRow(row);
    });

    summarySheet.mergeCells("A1:B1");
    summarySheet.mergeCells("A2:B2");
    summarySheet.mergeCells("A7:B7");
    summarySheet.mergeCells("A11:B11");

    workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }),
            "RNA质量分析报告.xlsx"
        );
    });
}

function getColumnWidth(header) {
    const widths = {
        "模板ID": 18,
        "RNA浓度": 15,
        "A260_A280": 15,
        "A260_A230": 15,
        "RNA质量": 12,
        "质量原因": 30,
        "污染分析": 40,
        "污染类型": 30,
        "提取建议": 50,
        "下游实验建议": 30,
        "RT状态": 12,
        "RT模板量": 15,
        "RT建议": 30
    };
    return widths[header] || 20;
}
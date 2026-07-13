/**
 * Excel 导出器
 *
 * 统一处理 Excel 导出，支持：
 * - 大批量数据分块写入（避免内存溢出）
 * - 图表高清插入（ECharts → PNG → Excel）
 * - 冻结首行、自动换行等格式化
 * - Sheet1: 样本数据 / Sheet2: 总结报告
 */
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { createReportModel } from "./reportModel";
import { exportChartImage } from "../chart/chartManager";
import { processChunk } from "../../utils/chunkProcess";

// 每批处理数量（大数据量优化）
const CHUNK_SIZE = 500;

/**
 * 导出 Excel 报告
 * 
 * @param {Object} data 实验数据
 * @param {Object} charts 图表配置
 * @param {Function} onProgress 进度回调
 * @returns {Promise<void>}
 */
export async function exportExcel(data, charts = {}, onProgress = null) {
    try {
        // 创建报告数据模型
        const report = createReportModel({ ...data, charts });
        
        // 创建工作簿
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "RNA质量检测工具";
        workbook.created = new Date();
        workbook.lastModifiedBy = report.experimentInfo.operator || "RNA质量检测工具";
        
        // Sheet1: 样本数据
        await createSampleSheet(workbook, report.samples, onProgress);
        
        // Sheet2: 总结报告
        await createSummarySheet(workbook, report, charts);
        
        // 导出
        const buffer = await workbook.xlsx.writeBuffer();
        
        // 生成文件名
        const fileName = generateFileName(report);
        
        // 下载
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }),
            fileName
        );
        
        if (onProgress) {
            onProgress(100);
        }
        
    } catch (error) {
        console.error("Excel 导出失败:", error);
        throw error;
    }
}

/**
 * 创建样本数据表（Sheet1）
 * 
 * @param {Object} workbook ExcelJS 工作簿
 * @param {Array} samples 样本数据
 * @param {Function} onProgress 进度回调
 */
async function createSampleSheet(workbook, samples, onProgress) {
    const sheet = workbook.addWorksheet("样本数据");
    
    // 定义列
    sheet.columns = [
        { header: "模板ID", key: "templateId", width: 18 },
        { header: "RNA浓度", key: "concentration", width: 15 },
        { header: "A260/280", key: "a260280", width: 12 },
        { header: "A260/230", key: "a260230", width: 12 },
        { header: "RNA质量", key: "quality", width: 12 },
        { header: "质量评分", key: "qualityScore", width: 10 },
        { header: "污染分析", key: "pollution", width: 40 },
        { header: "提取问题", key: "extractionProblem", width: 30 },
        { header: "优化建议", key: "suggestion", width: 50 }
    ];
    
    // 冻结首行
    sheet.views = [{
        state: "frozen",
        ySplit: 1
    }];
    
    // 标题行样式
    const headerRow = sheet.getRow(1);
    headerRow.height = 25;
    headerRow.eachCell(cell => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "409EFF" }
        };
        cell.font = {
            bold: true,
            color: { argb: "FFFFFF" },
            size: 12
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true
        };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
    });
    
    // 分块写入数据（大数据量优化）
    await processChunk(samples, async (chunk) => {
        chunk.forEach(item => {
            const row = sheet.addRow(item);
            row.height = 30;
            row.eachCell(cell => {
                cell.alignment = {
                    vertical: "top",
                    wrapText: true
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });
        });
    }, CHUNK_SIZE, onProgress);
}

/**
 * 创建总结报告表（Sheet2）
 * 
 * @param {Object} workbook ExcelJS 工作簿
 * @param {Object} report 报告数据模型
 * @param {Object} charts 图表实例
 */
async function createSummarySheet(workbook, report, charts) {
    const sheet = workbook.addWorksheet("总结");
    
    // 标题行
    sheet.mergeCells("A1:F1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "RNA质量检测实验报告";
    titleCell.font = {
        bold: true,
        size: 18,
        color: { argb: "303133" }
    };
    titleCell.alignment = {
        horizontal: "center",
        vertical: "middle"
    };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "E8F4FD" }
    };
    titleCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };
    sheet.getRow(1).height = 40;
    
    let currentRow = 3;
    
    // 实验信息
    currentRow = await addSection(sheet, currentRow, "实验信息", [
        ["实验名称", report.experimentInfo.name],
        ["实验日期", report.experimentInfo.date],
        ["操作人员", report.experimentInfo.operator],
        ["提取方法", report.experimentInfo.extractionMethod]
    ]);
    
    // 提取及RT参数
    currentRow = await addSection(sheet, currentRow, "提取及RT参数", [
        ["提取方法", report.parameters.extractionMethod],
        ["RT模板", report.parameters.rt?.template || "-"],
        ["RNA用量", report.parameters.rt?.rnaAmount ? report.parameters.rt.rnaAmount + " ng" : "-"],
        ["反应体积", report.parameters.rt?.reactionVolume ? report.parameters.rt.reactionVolume + " μL" : "-"]
    ]);
    
    // 实验管理
    currentRow = await addSection(sheet, currentRow, "实验管理", [
        ["总样本数", report.summary.total],
        ["有效样本", report.summary.valid],
        ["忽略样本", report.summary.ignored],
        ["平均浓度", report.summary.avgConcentration + " ng/μL"]
    ]);
    
    // 总体分析
    currentRow = await addSection(sheet, currentRow, "总体分析", [
        ["综合质量", report.summary.quality],
        ["分析结论", report.summary.conclusion]
    ], { wrapText: true });
    
    // 质量分布统计
    currentRow = await addSection(sheet, currentRow, "质量分布统计", [
        ...Object.entries(report.summary.qualityCount).map(([key, value]) => [key, value])
    ]);
    
    // 污染统计
    if (report.summary.pollutionCount && Object.keys(report.summary.pollutionCount).length > 0) {
        currentRow = await addSection(sheet, currentRow, "污染类型统计", [
            ...Object.entries(report.summary.pollutionCount).map(([key, value]) => [key, value])
        ]);
    }
    
    // 提取问题统计
    if (report.summary.extractionCount && Object.keys(report.summary.extractionCount).length > 0) {
        currentRow = await addSection(sheet, currentRow, "提取问题统计", [
            ...Object.entries(report.summary.extractionCount).map(([key, value]) => [key, value])
        ]);
    }
    
    // 插入图表
    if (charts) {
        currentRow = await insertCharts(sheet, currentRow, charts);
    }
    
    // 提取过程建议
    if (report.summary.extractionSummaryText) {
        currentRow = await addSection(sheet, currentRow, "提取过程建议", [
            ["建议", report.summary.extractionSummaryText]
        ], { wrapText: true });
    }
}

/**
 * 添加章节
 * 
 * @param {Object} sheet ExcelJS 工作表
 * @param {number} startRow 起始行
 * @param {string} title 章节标题
 * @param {Array} items 内容数组 [[label, value], ...]
 * @param {Object} options 选项
 * @returns {number} 下一行位置
 */
function addSection(sheet, startRow, title, items, options = {}) {
    // 标题行
    sheet.mergeCells(`A${startRow}:B${startRow}`);
    const titleCell = sheet.getCell(`A${startRow}`);
    titleCell.value = title;
    titleCell.font = {
        bold: true,
        size: 13,
        color: { argb: "409EFF" }
    };
    titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F5F7FA" }
    };
    titleCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };
    sheet.getRow(startRow).height = 28;
    
    let currentRow = startRow + 1;
    
    // 内容行
    items.forEach(([label, value]) => {
        const labelCell = sheet.getCell(`A${currentRow}`);
        labelCell.value = label;
        labelCell.font = { bold: true };
        labelCell.alignment = { vertical: "top" };
        labelCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        
        const valueCell = sheet.getCell(`B${currentRow}`);
        valueCell.value = value;
        valueCell.alignment = {
            vertical: "top",
            wrapText: options.wrapText || false
        };
        valueCell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };
        
        sheet.getRow(currentRow).height = 25;
        currentRow++;
    });
    
    // 空行
    currentRow++;
    
    return currentRow;
}

/**
 * 插入图表
 * 
 * @param {Object} sheet ExcelJS 工作表
 * @param {number} startRow 起始行
 * @param {Object} charts 图表实例
 * @returns {number} 下一行位置
 */
async function insertCharts(sheet, startRow, charts) {
    let currentRow = startRow;
    
    // 质量分布图
    if (charts.quality) {
        await insertChartImage(sheet, charts.quality, `A${currentRow}:D${currentRow + 20}`);
        currentRow += 25;
    }
    
    // 污染分析图
    if (charts.pollution) {
        await insertChartImage(sheet, charts.pollution, `A${currentRow}:D${currentRow + 20}`);
        currentRow += 25;
    }
    
    return currentRow;
}

/**
 * 插入图表图片到 Excel
 * 
 * @param {Object} sheet ExcelJS 工作表
 * @param {Object} chart ECharts 实例
 * @param {string} position 位置范围（如 "A1:D20"）
 */
async function insertChartImage(sheet, chart, position) {
    try {
        // 导出图表为高清图片
        const imageData = exportChartImage(chart.id || 'chart', {
            pixelRatio: 3,
            backgroundColor: '#ffffff' // 固定白底，便于打印
        });
        
        if (!imageData) return;
        
        // 添加图片到工作簿
        const imageId = sheet.workbook.addImage({
            base64: imageData.split(',')[1],
            extension: 'png'
        });
        
        // 插入图片
        sheet.addImage(imageId, {
            tl: { col: 0, row: parseInt(position.match(/\d+/)[0]) - 1 },
            br: { col: 5, row: parseInt(position.match(/\d+/g)[1]) }
        });
    } catch (error) {
        console.warn("插入图表失败:", error);
    }
}

/**
 * 生成文件名
 * 
 * @param {Object} report 报告数据模型
 * @returns {string} 文件名
 */
function generateFileName(report) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}`;
    
    return `RNA质量检测报告_${dateStr}_${timeStr}.xlsx`;
}
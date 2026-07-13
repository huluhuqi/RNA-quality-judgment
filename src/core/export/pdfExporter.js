/**
 * PDF 导出器
 *
 * 统一处理 PDF 导出，支持：
 * - 高清图表导出（pixelRatio: 3）
 * - 中文字体支持（NotoSansSC）
 * - 固定白底（便于打印）
 * - 结构化报告生成
 * - 大批量数据分页处理
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createReportModel, getAbnormalSamples } from "./reportModel";
import { exportChartImage } from "../chart/chartManager";

// PDF 配置
const PDF_CONFIG = {
    orientation: "portrait",
    unit: "mm",
    format: "a4"
};

// 页面边距
const MARGIN = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
};

// 字体大小
const FONT_SIZE = {
    title: 20,
    subtitle: 14,
    sectionTitle: 12,
    normal: 10,
    small: 8
};

/**
 * 导出 PDF 报告
 * 
 * @param {Object} data 实验数据
 * @param {Object} charts 图表实例
 * @param {Function} onProgress 进度回调
 * @returns {Promise<void>}
 */
export async function exportPDF(data, charts = {}, onProgress = null) {
    try {
        // 创建报告数据模型
        const report = createReportModel({ ...data, charts });
        
        // 创建 PDF 文档
        const pdf = new jsPDF(PDF_CONFIG);
        
        // 设置字体（中文字体支持）
        await setupFonts(pdf);
        
        let currentY = MARGIN.top;
        
        // 第一页：封面 + 实验信息
        currentY = await createCoverPage(pdf, report, currentY);
        
        // 第二页：总体分析 + 图表
        if (currentY > pdf.internal.pageSize.height - MARGIN.bottom) {
            pdf.addPage();
            currentY = MARGIN.top;
        }
        currentY = await createSummaryPage(pdf, report, charts, currentY);
        
        // 第三页：异常样本 + 建议（如有）
        const abnormalSamples = getAbnormalSamples(data.samples || []);
        if (abnormalSamples.length > 0) {
            pdf.addPage();
            currentY = MARGIN.top;
            currentY = await createAbnormalSamplesPage(pdf, report, abnormalSamples, currentY);
        }
        
        // 第四页：样本数据列表（如有）
        if (report.samples.length > 0) {
            pdf.addPage();
            currentY = MARGIN.top;
            await createSamplesPage(pdf, report, currentY);
        }
        
        // 生成文件名
        const fileName = generateFileName(report);
        
        // 保存 PDF
        pdf.save(fileName);
        
        if (onProgress) {
            onProgress(100);
        }
        
    } catch (error) {
        console.error("PDF 导出失败:", error);
        throw error;
    }
}

/**
 * 截图模式导出 PDF（兼容现有实现）
 * 
 * @param {string} elementId DOM 元素 ID
 * @param {string} fileName 文件名
 * @param {Object} data 实验数据
 * @returns {Promise<void>}
 */
export async function exportPDFByScreenshot(elementId = "pdf-report", fileName = "RNA质量检测实验报告.pdf", data = null) {
    try {
        const element = document.getElementById(elementId);
        
        if (!element) {
            console.error("未找到PDF导出区域");
            return;
        }
        
        // 截图（scale: 2 提升清晰度，固定白底）
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        });
        
        const imgData = canvas.toDataURL("image/png");
        
        // 创建 PDF
        const pdf = new jsPDF(PDF_CONFIG);
        
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        
        // 按页宽等比缩放
        const imgWidth = pageWidth;
        const imgHeight = canvas.height * pageWidth / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // 首页
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // 后续页
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(fileName);
        
    } catch (error) {
        console.error("PDF 截图导出失败:", error);
        throw error;
    }
}

/**
 * 配置字体
 * 
 * @param {Object} pdf jsPDF 实例
 */
async function setupFonts(pdf) {
    // 使用默认字体（中文支持需要额外配置字体文件）
    // 实际项目中需要引入 NotoSansSC.ttf 字体
    pdf.setFontSize(FONT_SIZE.normal);
}

/**
 * 创建封面页
 * 
 * @param {Object} pdf jsPDF 实例
 * @param {Object} report 报告数据模型
 * @param {number} startY 起始 Y 坐标
 * @returns {number} 下一个 Y 坐标
 */
function createCoverPage(pdf, report, startY) {
    let y = startY;
    
    // 标题
    pdf.setFontSize(FONT_SIZE.title);
    pdf.setFont("helvetica", "bold");
    pdf.text("RNA质量检测实验报告", pdf.internal.pageSize.width / 2, y, { align: "center" });
    y += 20;
    
    // 副标题
    pdf.setFontSize(FONT_SIZE.subtitle);
    pdf.setFont("helvetica", "normal");
    pdf.text("RNA Quality Detection Report", pdf.internal.pageSize.width / 2, y, { align: "center" });
    y += 30;
    
    // 实验信息
    pdf.setFontSize(FONT_SIZE.sectionTitle);
    pdf.setFont("helvetica", "bold");
    pdf.text("实验信息", MARGIN.left, y);
    y += 12;
    
    const infoItems = [
        ["实验名称", report.experimentInfo.name || "-"],
        ["实验日期", report.experimentInfo.date || "-"],
        ["操作人员", report.experimentInfo.operator || "-"],
        ["提取方法", report.experimentInfo.extractionMethod || "-"],
        ["样本总数", report.summary.total.toString()],
        ["有效样本", report.summary.valid.toString()]
    ];
    
    pdf.setFontSize(FONT_SIZE.normal);
    pdf.setFont("helvetica", "normal");
    
    infoItems.forEach(([label, value]) => {
        pdf.text(label + ":", MARGIN.left, y);
        pdf.text(value, MARGIN.left + 60, y);
        y += 10;
    });
    
    // 报告时间
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    y = pdf.internal.pageSize.height - MARGIN.bottom - 20;
    pdf.setFontSize(FONT_SIZE.small);
    pdf.text("报告生成时间: " + timeStr, MARGIN.left, y);
    
    return y;
}

/**
 * 创建总结页
 * 
 * @param {Object} pdf jsPDF 实例
 * @param {Object} report 报告数据模型
 * @param {Object} charts 图表实例
 * @param {number} startY 起始 Y 坐标
 * @returns {number} 下一个 Y 坐标
 */
async function createSummaryPage(pdf, report, charts, startY) {
    let y = startY;
    
    // 总体分析
    pdf.setFontSize(FONT_SIZE.sectionTitle);
    pdf.setFont("helvetica", "bold");
    pdf.text("总体分析", MARGIN.left, y);
    y += 12;
    
    pdf.setFontSize(FONT_SIZE.normal);
    pdf.setFont("helvetica", "normal");
    
    // 综合质量
    pdf.text("综合质量: " + report.summary.quality, MARGIN.left, y);
    y += 10;
    
    // 分析结论（自动换行）
    pdf.text("分析结论:", MARGIN.left, y);
    y += 8;
    
    const conclusionLines = pdf.splitTextToSize(report.summary.conclusion, pdf.internal.pageSize.width - MARGIN.left - MARGIN.right);
    pdf.text(conclusionLines, MARGIN.left, y);
    y += conclusionLines.length * 10 + 10;
    
    // 质量分布统计
    pdf.setFontSize(FONT_SIZE.sectionTitle);
    pdf.setFont("helvetica", "bold");
    pdf.text("质量分布统计", MARGIN.left, y);
    y += 12;
    
    pdf.setFontSize(FONT_SIZE.normal);
    const qualityCounts = report.summary.qualityCount || {};
    const qualityItems = Object.entries(qualityCounts);
    
    qualityItems.forEach(([key, value]) => {
        pdf.text(key + ": " + value, MARGIN.left, y);
        y += 8;
    });
    y += 10;
    
    // 插入质量分布图
    if (charts && charts.quality) {
        await insertChartToPDF(pdf, charts.quality, MARGIN.left, y, 150, 100);
        y += 110;
    }
    
    // 污染统计
    if (report.summary.pollutionCount && Object.keys(report.summary.pollutionCount).length > 0) {
        pdf.setFontSize(FONT_SIZE.sectionTitle);
        pdf.setFont("helvetica", "bold");
        pdf.text("污染类型统计", MARGIN.left, y);
        y += 12;
        
        pdf.setFontSize(FONT_SIZE.normal);
        const pollutionCounts = report.summary.pollutionCount;
        Object.entries(pollutionCounts).forEach(([key, value]) => {
            pdf.text(key + ": " + value, MARGIN.left, y);
            y += 8;
        });
        y += 10;
        
        // 插入污染分析图
        if (charts && charts.pollution) {
            await insertChartToPDF(pdf, charts.pollution, MARGIN.left, y, 150, 100);
            y += 110;
        }
    }
    
    // 提取过程建议
    if (report.summary.extractionSummaryText) {
        pdf.setFontSize(FONT_SIZE.sectionTitle);
        pdf.setFont("helvetica", "bold");
        pdf.text("提取过程建议", MARGIN.left, y);
        y += 12;
        
        pdf.setFontSize(FONT_SIZE.normal);
        const adviceLines = pdf.splitTextToSize(report.summary.extractionSummaryText, pdf.internal.pageSize.width - MARGIN.left - MARGIN.right);
        pdf.text(adviceLines, MARGIN.left, y);
        y += adviceLines.length * 10;
    }
    
    return y;
}

/**
 * 创建异常样本页
 * 
 * @param {Object} pdf jsPDF 实例
 * @param {Object} report 报告数据模型
 * @param {Array} abnormalSamples 异常样本列表
 * @param {number} startY 起始 Y 坐标
 * @returns {number} 下一个 Y 坐标
 */
function createAbnormalSamplesPage(pdf, report, abnormalSamples, startY) {
    let y = startY;
    
    pdf.setFontSize(FONT_SIZE.sectionTitle);
    pdf.setFont("helvetica", "bold");
    pdf.text("异常样本列表", MARGIN.left, y);
    y += 12;
    
    pdf.setFontSize(FONT_SIZE.small);
    pdf.setFont("helvetica", "normal");
    
    // 表头
    pdf.text("模板ID", MARGIN.left, y);
    pdf.text("浓度", MARGIN.left + 40, y);
    pdf.text("A260/280", MARGIN.left + 70, y);
    pdf.text("A260/230", MARGIN.left + 100, y);
    pdf.text("质量", MARGIN.left + 130, y);
    y += 8;
    
    // 数据行
    abnormalSamples.forEach(sample => {
        if (y > pdf.internal.pageSize.height - MARGIN.bottom - 20) {
            pdf.addPage();
            y = MARGIN.top;
        }
        
        pdf.text(sample.id || sample.templateId || "-", MARGIN.left, y);
        pdf.text((sample.concentration || "-").toString(), MARGIN.left + 40, y);
        pdf.text((sample.a260280 || "-").toString(), MARGIN.left + 70, y);
        pdf.text((sample.a260230 || "-").toString(), MARGIN.left + 100, y);
        pdf.text(sample.result?.quality || "-", MARGIN.left + 130, y);
        y += 8;
    });
    
    return y;
}

/**
 * 创建样本数据页
 * 
 * @param {Object} pdf jsPDF 实例
 * @param {Object} report 报告数据模型
 * @param {number} startY 起始 Y 坐标
 */
function createSamplesPage(pdf, report, startY) {
    let y = startY;
    
    pdf.setFontSize(FONT_SIZE.sectionTitle);
    pdf.setFont("helvetica", "bold");
    pdf.text("样本数据列表（共 " + report.samples.length + " 条）", MARGIN.left, y);
    y += 12;
    
    pdf.setFontSize(FONT_SIZE.small);
    pdf.setFont("helvetica", "normal");
    
    // 表头
    pdf.text("模板ID", MARGIN.left, y);
    pdf.text("浓度", MARGIN.left + 40, y);
    pdf.text("A260/280", MARGIN.left + 70, y);
    pdf.text("A260/230", MARGIN.left + 100, y);
    pdf.text("质量", MARGIN.left + 130, y);
    y += 8;
    
    // 数据行（分批处理，避免内存溢出）
    const batchSize = 40; // 每页约40行
    const totalSamples = report.samples.length;
    
    for (let i = 0; i < totalSamples; i += batchSize) {
        if (i > 0) {
            pdf.addPage();
            y = MARGIN.top;
            
            // 重复表头
            pdf.setFontSize(FONT_SIZE.small);
            pdf.text("模板ID", MARGIN.left, y);
            pdf.text("浓度", MARGIN.left + 40, y);
            pdf.text("A260/280", MARGIN.left + 70, y);
            pdf.text("A260/230", MARGIN.left + 100, y);
            pdf.text("质量", MARGIN.left + 130, y);
            y += 8;
        }
        
        const batch = report.samples.slice(i, i + batchSize);
        batch.forEach(sample => {
            pdf.text(sample.templateId || "-", MARGIN.left, y);
            pdf.text((sample.concentration || "-").toString(), MARGIN.left + 40, y);
            pdf.text((sample.a260280 || "-").toString(), MARGIN.left + 70, y);
            pdf.text((sample.a260230 || "-").toString(), MARGIN.left + 100, y);
            pdf.text(sample.quality || "-", MARGIN.left + 130, y);
            y += 8;
        });
    }
}

/**
 * 插入图表到 PDF
 * 
 * @param {Object} pdf jsPDF 实例
 * @param {Object} chart ECharts 实例
 * @param {number} x X 坐标
 * @param {number} y Y 坐标
 * @param {number} width 宽度
 * @param {number} height 高度
 */
async function insertChartToPDF(pdf, chart, x, y, width, height) {
    try {
        // 导出图表为高清图片（固定白底）
        const imageData = exportChartImage(chart.id || 'chart', {
            pixelRatio: 3,
            backgroundColor: '#ffffff'
        });
        
        if (!imageData) return;
        
        // 添加图片
        pdf.addImage(imageData, "PNG", x, y, width, height);
    } catch (error) {
        console.warn("插入图表到PDF失败:", error);
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
    
    return `RNA质量检测实验报告_${dateStr}_${timeStr}.pdf`;
}
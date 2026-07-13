import jsPDF from "jspdf";
import { buildReport } from "./reportBuilder";

export function exportPDF(data, charts = {}) {
    const report = buildReport(data);
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    let y = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const marginLeft = 20;

    pdf.setFontSize(18);
    pdf.setFont("bold");
    pdf.text(report.title, pageWidth / 2, y, { align: "center" });
    y += 15;

    pdf.setFontSize(12);
    pdf.setFont("normal");
    pdf.text(`生成日期: ${new Date().toLocaleString("zh-CN")}`, pageWidth / 2, y, { align: "center" });
    y += 20;

    pdf.setFontSize(14);
    pdf.setFont("bold");
    pdf.text("1. 实验信息", marginLeft, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("normal");
    pdf.text(`提取方法: ${report.experiment.extraction?.method || "未填写"}`, marginLeft, y);
    y += 7;
    pdf.text(`样本来源: ${report.experiment.extraction?.source || "未填写"}`, marginLeft, y);
    y += 7;
    pdf.text(`下游用途: ${report.experiment.application?.purpose || "未填写"}`, marginLeft, y);
    y += 15;

    pdf.setFontSize(14);
    pdf.setFont("bold");
    pdf.text("2. 样本统计", marginLeft, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("normal");
    pdf.text(`总样本数: ${report.samples.length}`, marginLeft, y);
    y += 7;
    if (report.summary) {
        pdf.text(`合格: ${report.summary.quality?.good || 0}`, marginLeft, y);
        y += 7;
        pdf.text(`需关注: ${report.summary.quality?.warning || 0}`, marginLeft, y);
        y += 7;
        pdf.text(`不合格: ${report.summary.quality?.bad || 0}`, marginLeft, y);
        y += 7;
    }
    y += 15;

    if (charts?.quality) {
        pdf.setFontSize(14);
        pdf.setFont("bold");
        pdf.text("3. RNA质量分布", marginLeft, y);
        y += 10;

        const qualityBase64 = charts.quality.replace(/^data:image\/png;base64,/, "");
        pdf.addImage(qualityBase64, "PNG", marginLeft, y, 160, 80);
        y += 90;
    }

    if (charts?.pollution) {
        pdf.setFontSize(14);
        pdf.setFont("bold");
        pdf.text("4. 污染分析", marginLeft, y);
        y += 10;

        const pollutionBase64 = charts.pollution.replace(/^data:image\/png;base64,/, "");
        pdf.addImage(pollutionBase64, "PNG", marginLeft, y, 160, 80);
        y += 90;
    }

    pdf.setFontSize(14);
    pdf.setFont("bold");
    pdf.text("5. 提取过程问题分析", marginLeft, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("normal");
    if (report.summary?.pollution) {
        const pollutionEntries = Object.entries(report.summary.pollution);
        if (pollutionEntries.length > 0) {
            pollutionEntries.forEach(([key, value]) => {
                pdf.text(`${key}: ${value}`, marginLeft, y);
                y += 7;
            });
        } else {
            pdf.text("未发现明显污染问题", marginLeft, y);
            y += 7;
        }
    } else {
        pdf.text("暂无污染分析数据", marginLeft, y);
        y += 7;
    }
    y += 15;

    pdf.setFontSize(14);
    pdf.setFont("bold");
    pdf.text("6. RT体系配置", marginLeft, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("normal");
    const firstSample = report.samples[0];
    if (firstSample?.rt) {
        pdf.text(`RNA投入量: ${firstSample.rt.targetRNA || ""} ng`, marginLeft, y);
        y += 7;
        pdf.text(`RNA模板体积: ${firstSample.rt.templateVolume !== null && firstSample.rt.templateVolume !== undefined ? firstSample.rt.templateVolume + " μL" : "无法配置"}`, marginLeft, y);
        y += 7;
        pdf.text(`最大模板体积: ${firstSample.rt.maxTemplateVolume || 12} μL`, marginLeft, y);
        y += 7;
        pdf.text(`RT补水体积: ${firstSample.rt.waterVolume !== null && firstSample.rt.waterVolume !== undefined ? firstSample.rt.waterVolume + " μL" : "无法配置"}`, marginLeft, y);
        y += 7;
        pdf.text(`状态: ${firstSample.rt.statusText || ""}`, marginLeft, y);
        y += 7;
        if (firstSample.rt.suggestion) {
            pdf.text(`建议: ${firstSample.rt.suggestion}`, marginLeft, y);
            y += 7;
        }
        if (firstSample.rt.requiredConcentration !== null && firstSample.rt.requiredConcentration !== undefined) {
            pdf.text(`最低推荐浓度: ${firstSample.rt.requiredConcentration} ng/μL`, marginLeft, y);
            y += 7;
        }
    } else {
        pdf.text("暂无RT体系配置数据", marginLeft, y);
        y += 7;
    }
    y += 15;

    pdf.setFontSize(14);
    pdf.setFont("bold");
    pdf.text("7. 总结建议", marginLeft, y);
    y += 10;

    pdf.setFontSize(11);
    pdf.setFont("normal");
    if (report.samples.length > 0) {
        const goodCount = report.samples.filter(s => s.quality?.level === "合格").length;
        const ratio = (goodCount / report.samples.length * 100).toFixed(1);
        pdf.text(`本批次RNA样本总数: ${report.samples.length} 个`, marginLeft, y);
        y += 7;
        pdf.text(`合格率: ${ratio}%`, marginLeft, y);
        y += 7;
        if (goodCount === report.samples.length) {
            pdf.text("结论: 本批次RNA整体质量良好，可以用于下游实验。", marginLeft, y);
        } else if (goodCount > report.samples.length * 0.5) {
            pdf.text("结论: 本批次RNA质量整体尚可，部分样本建议复检。", marginLeft, y);
        } else {
            pdf.text("结论: 本批次RNA质量较差，建议重新提取或优化实验条件。", marginLeft, y);
        }
    } else {
        pdf.text("暂无样本数据", marginLeft, y);
    }

    pdf.save("RNA质量分析报告.pdf");
}
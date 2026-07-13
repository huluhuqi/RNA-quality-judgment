/**
 * PDF 导出入口
 *
 * 通过 html2canvas 截取指定 DOM 区域（#pdf-report），
 * 分页写入 A4 纵向 PDF。
 * 保留网页主题颜色与 ECharts 图表。
 */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createPDFData } from "./pdfTemplate";
import { handleError } from "../../../core/error/errorHandler";
import { ErrorType } from "../../../core/error/errorType";


/**
 * 导出 RNA 质量检测 PDF 报告
 *
 * @param {string} elementId 需要截图的DOM根元素id，默认 "pdf-report"
 * @param {string} fileName 输出文件名
 * @param {Object} data 可选，传入则进行结构化校验（供后续扩展直接绘制PDF）
 */
export async function exportPDF(
    elementId = "pdf-report",
    fileName = "RNA质量检测实验报告.pdf",
    data = null
){
    try {
        if(data){
            createPDFData(data);
        }


        const element = document.getElementById(elementId);

        if(!element){
            console.error("未找到PDF导出区域");
            return;
        }


        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
        });


        const imgData = canvas.toDataURL("image/png");


        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;

        const imgWidth = pageWidth;
        const imgHeight = canvas.height * pageWidth / canvas.width;


        let heightLeft = imgHeight;
        let position = 0;


        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;


        while(heightLeft > 0){
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }


        pdf.save(fileName);
    } catch (e) {
        handleError(e, ErrorType.EXPORT_PDF, 'PDF导出');
        throw new Error('PDF生成失败');
    }


}

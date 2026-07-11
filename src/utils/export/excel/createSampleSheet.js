/**
 * Sheet1：样本数据
 *
 * 直接读取 formatSamples 的结果，不重新分析，
 * 保证 Excel 与页面显示完全一致。
 *
 * 第9.11.3步：新增提取方法、提取过程问题分析列。
 */
import { qualityColor, autoRowHeight, ExcelTheme } from "./excelStyle";


export function createSampleSheet(workbook, formattedSamples){


    const sheet1 = workbook.addWorksheet("样本数据");

    sheet1.views = [{ state:"frozen", ySplit:1 }];

    sheet1.columns = [
        { header:"模板ID", key:"id", width:18 },
        { header:"提取方法", key:"extractionMethod", width:20 },
        { header:"RNA浓度(ng/μL)", key:"concentration", width:18 },
        { header:"A260/280", key:"a260280", width:15 },
        { header:"A260/230", key:"a260230", width:15 },
        { header:"RNA质量", key:"quality", width:12 },
        { header:"污染分析", key:"pollution", width:40 },
        { header:"提取过程问题分析", key:"extractionProblem", width:60 },
        { header:"建议", key:"suggestion", width:60 }
    ];


    // 直接使用格式化数据，不重新分析
    formattedSamples.forEach(item => {

        const row = sheet1.addRow({
            id: item.id,
            extractionMethod: item.extractionMethod || '',
            concentration: item.concentration ?? '',
            a260280: item.a260280 ?? '',
            a260230: item.a260230 ?? '',
            quality: item.quality,
            pollution: item.pollution,
            extractionProblem: item.extractionProblem,
            advice: item.suggestion
        });


        // 质量列着色（第6列，因新增了提取方法列）
        row.getCell(6).fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{ argb: qualityColor(item.quality) }
        };

        // 较差样本整行红色字体
        if(item.quality === "较差"){
            row.eachCell(cell => {
                cell.font = { color:{ argb: ExcelTheme.danger } };
            });
        }

    });


    // 表头样式
    sheet1.getRow(1).eachCell(cell => {
        cell.font = { bold:true, color:{argb:"FFFFFF"}, size:12 };
        cell.fill = { type:"pattern", pattern:"solid", fgColor:{argb:ExcelTheme.headerBg} };
        cell.alignment = { horizontal:"center", vertical:"middle" };
    });
    sheet1.getRow(1).height = 28;

    // 内容自动换行
    sheet1.eachRow((row, rowNum) => {
        if(rowNum === 1) return;
        row.eachCell(cell => {
            cell.alignment = { vertical:"top", wrapText:true };
        });
    });

    autoRowHeight(sheet1);

    return sheet1;
}

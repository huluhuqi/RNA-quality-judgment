/**
 * Sheet2：总结报告
 *
 * 包含标题区、实验信息、RT参数、总体分析、污染分析、
 * RT模板建议、ECharts 图表区域、打印与页面设置。
 */
import { setCellStyle, autoRowHeight, ExcelTheme } from "./excelStyle";
import { downstreamApplications } from "../../../config/downstreamApplication";


export function createSummarySheet(workbook, summary, settings, charts){


    const sheet2 = workbook.addWorksheet("总结报告");

    sheet2.views = [{ state:"frozen", ySplit:3 }];

    sheet2.columns = [
        { width:22 }, { width:25 }, { width:25 }, { width:25 },
        { width:20 }, { width:20 }
    ];

    const method = settings?.method || '硅胶膜柱提法';
    const application = settings?.application || 'qPCR';
    const appName = downstreamApplications[application]?.name || application;


    // ===== 标题区 =====
    sheet2.mergeCells("A1:F1");
    const title = sheet2.getCell("A1");
    title.value = "RNA质量检测实验报告";
    title.font = { bold:true, size:18, color:{argb:ExcelTheme.subtitle} };
    title.alignment = { horizontal:"center", vertical:"middle" };
    sheet2.getRow(1).height = 40;

    sheet2.mergeCells("A2:F2");
    const subtitle = sheet2.getCell("A2");
    subtitle.value = "生成日期：" + (settings?.date || new Date().toLocaleDateString());
    subtitle.font = { size:11, color:{argb:"909399"} };
    subtitle.alignment = { horizontal:"center", vertical:"middle" };
    sheet2.getRow(2).height = 22;


    // ===== 实验信息卡片 =====
    const infoStartRow = 4;
    sheet2.mergeCells(`A${infoStartRow}:F${infoStartRow}`);
    setCellStyle(sheet2.getCell(`A${infoStartRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionBlue
    });
    sheet2.getCell(`A${infoStartRow}`).value = "实验信息";
    sheet2.getRow(infoStartRow).height = 24;

    const info = [
        ["实验日期", settings?.date || "未填写"],
        ["实验人员", settings?.operator || "未填写"],
        ["RNA提取方法", method],
        ["下游实验用途", appName]
    ];
    info.forEach(item => sheet2.addRow(item));


    // ===== 提取及RT参数 =====
    sheet2.addRow([]);
    const rtParamRow = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${rtParamRow}:F${rtParamRow}`);
    setCellStyle(sheet2.getCell(`A${rtParamRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionOrange
    });
    sheet2.getCell(`A${rtParamRow}`).value = "提取及RT参数";
    sheet2.getRow(rtParamRow).height = 24;

    const rtParams = [
        ["最大RNA上样量", (settings?.maxRNA || 1000) + " ng"],
        ["最小RNA上样量", (settings?.minRNA || 10) + " ng"],
        ["最大模板体积", (settings?.maxVolume || 12) + " μL"],
        ["推荐RT投入", (summary?.rt?.recommendedRNA || 0) + " ng"],
        ["RT模板体积范围", (summary?.rt?.minVolume || 0) + " ~ " + (summary?.rt?.maxVolume || 0) + " μL"],
        ["RT浓度状态", summary?.rt?.level || "无法判断"]
    ];
    rtParams.forEach(item => sheet2.addRow(item));


    // ===== 总体分析 =====
    sheet2.addRow([]);
    const analysisRow = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${analysisRow}:F${analysisRow}`);
    setCellStyle(sheet2.getCell(`A${analysisRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionGreen
    });
    sheet2.getCell(`A${analysisRow}`).value = "总体分析";
    sheet2.getRow(analysisRow).height = 24;

    const qc = summary?.qualityCount || {};
    sheet2.addRow(["总样本数", summary?.totalCount || 0]);
    sheet2.addRow(["有效样本数", summary?.validCount || 0]);
    sheet2.addRow(["忽略样本数", summary?.ignoredCount || 0]);
    sheet2.addRow(["平均浓度", (summary?.avgConcentration || 0) + " ng/μL"]);
    sheet2.addRow(["总体质量", summary?.quality || "待检测"]);
    sheet2.addRow(["优秀", (qc['优秀'] || 0) + " 个"]);
    sheet2.addRow(["良好", (qc['良好'] || 0) + " 个"]);
    sheet2.addRow(["一般", (qc['一般'] || 0) + " 个"]);
    sheet2.addRow(["较差", (qc['较差'] || 0) + " 个"]);
    sheet2.addRow([]);
    sheet2.addRow(["待检测", (qc['待检测'] || 0) + " 个"]);


    // ===== 污染分析 =====
    sheet2.addRow([]);
    const pollRow = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${pollRow}:F${pollRow}`);
    setCellStyle(sheet2.getCell(`A${pollRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionRed
    });
    sheet2.getCell(`A${pollRow}`).value = "污染分析";
    sheet2.getRow(pollRow).height = 24;

    sheet2.addRow(["污染概况", summary?.pollution || "暂无数据"]);

    const pc = summary?.pollutionCount || {};
    sheet2.addRow(["蛋白/酚类污染", (pc['蛋白或酚类污染'] || 0) + " 个"]);
    sheet2.addRow(["盐类/试剂残留", (pc['盐类或试剂残留'] || 0) + " 个"]);
    sheet2.addRow(["双重污染风险", (pc['双重污染风险'] || 0) + " 个"]);

    // 异常样本列表
    const pollutionSamples = summary?.pollutionSamples || [];
    if(pollutionSamples.length > 0){
        sheet2.addRow([]);
        sheet2.addRow(["异常样本列表"]);
        pollutionSamples.forEach(item => {
            sheet2.addRow([item.id, item.pollution]);
        });
    }


    // ===== 提取流程问题统计 =====
    sheet2.addRow([]);
    const extractRow = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${extractRow}:F${extractRow}`);
    setCellStyle(sheet2.getCell(`A${extractRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionGray
    });
    sheet2.getCell(`A${extractRow}`).value = "提取流程问题统计";
    sheet2.getRow(extractRow).height = 24;

    const ec = summary?.extractionCount || {};
    const extractionKeys = Object.keys(ec);

    if(extractionKeys.length > 0){
        extractionKeys.forEach(key => {
            sheet2.addRow([key, ec[key] + " 个样本"]);
        });
    } else {
        sheet2.addRow(["未发现明显提取流程异常"]);
    }

    // 总体优化建议
    if(summary?.extractionSummaryText){
        sheet2.addRow([]);
        sheet2.addRow(["总体优化建议", summary.extractionSummaryText]);
    }


    // ===== RT模板建议 =====
    sheet2.addRow([]);
    const rtSuggRow = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${rtSuggRow}:F${rtSuggRow}`);
    setCellStyle(sheet2.getCell(`A${rtSuggRow}`), {
        font:{ bold:true, color:{argb:"FFFFFF"} },
        fill:ExcelTheme.sectionGray
    });
    sheet2.getCell(`A${rtSuggRow}`).value = "RT模板建议";
    sheet2.getRow(rtSuggRow).height = 24;

    if(summary?.rt?.message){
        sheet2.addRow(["RT策略说明", summary.rt.message]);
    }
    if(summary?.rtWarning){
        sheet2.addRow(["浓度差异警告", summary.rtWarning]);
    }


    // ===== 图表区域 =====
    sheet2.addRow([]);
    const chartTitleRow1 = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${chartTitleRow1}:F${chartTitleRow1}`);
    setCellStyle(sheet2.getCell(`A${chartTitleRow1}`), {
        font:{ bold:true, size:14 },
        fill:ExcelTheme.sectionBlue
    });
    sheet2.getCell(`A${chartTitleRow1}`).value = "RNA质量分布";
    sheet2.getRow(chartTitleRow1).height = 24;

    if(charts?.quality){
        const base64 = charts.quality.replace(/^data:image\/png;base64,/, "");
        const imageId1 = workbook.addImage({ base64, extension:"png" });
        sheet2.addImage(imageId1, {
            tl:{ col:0, row:chartTitleRow1 },
            ext:{ width:550, height:300 }
        });
    }

    // 预留图表空间
    for(let i = 0; i < 15; i++){
        sheet2.addRow([]);
    }

    const chartTitleRow2 = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${chartTitleRow2}:F${chartTitleRow2}`);
    setCellStyle(sheet2.getCell(`A${chartTitleRow2}`), {
        font:{ bold:true, size:14 },
        fill:ExcelTheme.sectionRed
    });
    sheet2.getCell(`A${chartTitleRow2}`).value = "污染类型分析";
    sheet2.getRow(chartTitleRow2).height = 24;

    if(charts?.pollution){
        const base64 = charts.pollution.replace(/^data:image\/png;base64,/, "");
        const imageId2 = workbook.addImage({ base64, extension:"png" });
        sheet2.addImage(imageId2, {
            tl:{ col:0, row:chartTitleRow2 },
            ext:{ width:550, height:300 }
        });
    }

    // 预留图表空间
    for(let i = 0; i < 15; i++){
        sheet2.addRow([]);
    }

    const chartTitleRow3 = sheet2.rowCount + 1;
    sheet2.mergeCells(`A${chartTitleRow3}:F${chartTitleRow3}`);
    setCellStyle(sheet2.getCell(`A${chartTitleRow3}`), {
        font:{ bold:true, size:14 },
        fill:ExcelTheme.sectionGray
    });
    sheet2.getCell(`A${chartTitleRow3}`).value = "提取流程问题分析";
    sheet2.getRow(chartTitleRow3).height = 24;

    if(charts?.extraction){
        const base64 = charts.extraction.replace(/^data:image\/png;base64,/, "");
        const imageId3 = workbook.addImage({ base64, extension:"png" });
        sheet2.addImage(imageId3, {
            tl:{ col:0, row:chartTitleRow3 },
            ext:{ width:550, height:300 }
        });
    }


    // ===== 打印与页面设置 =====
    sheet2.pageSetup = {
        paperSize:9,
        orientation:"portrait",
        fitToPage:true,
        fitToWidth:1,
        fitToHeight:0
    };

    sheet2.headerFooter = {
        oddHeader:"&C RNA质量检测报告",
        oddFooter:"&C 第 &P 页 / 共 &N 页"
    };


    // 所有单元格换行
    sheet2.eachRow(row => {
        row.eachCell(cell => {
            if(!cell.alignment || !cell.alignment.wrapText){
                cell.alignment = { vertical:"top", wrapText:true };
            }
        });
    });

    autoRowHeight(sheet2);

    return sheet2;
}

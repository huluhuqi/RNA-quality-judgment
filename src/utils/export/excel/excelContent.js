/**
 * Excel Sheet 构建逻辑
 *
 * 核心变化：不再调用 analyzeRNA，直接读取 formatSamplesForExport 的结果。
 * 保证 Excel 与页面显示完全一致。
 */
import { setCellStyle, qualityColor, autoRowHeight, ExcelTheme } from "./excelStyle";
import { downstreamApplications } from "../../../config/downstreamApplication";


/**
 * Sheet1：样本数据
 */
export function createSampleSheet(workbook, formattedSamples){


    const sheet1 = workbook.addWorksheet("样本数据");

    sheet1.views = [{ state:"frozen", ySplit:1 }];

    sheet1.columns = [
        { header:"模板ID", key:"id", width:18 },
        { header:"RNA浓度(ng/μL)", key:"concentration", width:18 },
        { header:"A260/280", key:"a260280", width:15 },
        { header:"A260/230", key:"a260230", width:15 },
        { header:"RNA质量", key:"quality", width:12 },
        { header:"污染分析", key:"pollution", width:45 },
        { header:"建议", key:"suggestion", width:70 }
    ];


    // 直接使用格式化数据，不重新分析
    formattedSamples.forEach(item => {

        const row = sheet1.addRow({
            id: item.id,
            concentration: item.concentration ?? '',
            a260280: item.a260280 ?? '',
            a260230: item.a260230 ?? '',
            quality: item.quality,
            pollution: item.pollution,
            advice: item.suggestion
        });


        // 质量列着色
        row.getCell(5).fill = {
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


/**
 * Sheet2：总结报告
 */
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

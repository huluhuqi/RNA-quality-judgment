import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { analyzeRNA } from "../core/RNAQuality";
import { extractionMethods } from "../config/extractionAdvice";
import { downstreamApplications } from "../config/downstreamApplication";


/**
 * 全局单元格样式设置
 */
function setCellStyle(cell, options={}){
    cell.font = {
        name:"微软雅黑",
        size:11,
        ...options.font
    };
    cell.alignment = {
        vertical:"center",
        wrapText:true,
        ...options.alignment
    };
    if(options.fill){
        cell.fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{argb:options.fill}
        };
    }
    if(options.border){
        cell.border = {
            top:{style:"thin"},
            bottom:{style:"thin"},
            left:{style:"thin"},
            right:{style:"thin"}
        };
    }
}


/**
 * 质量等级颜色
 */
function qualityColor(quality){
    switch(quality){
        case "优秀": return "C6E0B4";
        case "良好": return "DDEBF7";
        case "一般": return "FFF2CC";
        case "较差": return "F4CCCC";
        default: return "FFFFFF";
    }
}


/**
 * 自动行高（基于内容长度估算）
 */
function autoRowHeight(sheet){
    sheet.eachRow(row=>{
        if(row.height) return; // 已手动设置的跳过
        let max = 1;
        row.eachCell(cell=>{
            if(cell.value){
                max = Math.max(max, String(cell.value).length / 40);
            }
        });
        row.height = Math.min(Math.max(max * 15, 18), 120);
    });
}


/**
 * RNA质量检测报告Excel导出
 *
 * 输入数据结构：
 * {
 *   samples: [{id, concentration, a260280, a260230, ignored}],
 *   summary: {totalCount, validCount, ignoredCount, avgConcentration,
 *             quality, qualityCount, pollution, pollutionSamples,
 *             pollutionCount, applicationSummary, rt},
 *   settings: {method, application, maxRNA, minRNA, maxVolume, date, operator}
 * }
 */
export async function exportRNAReport(data, charts){


const {
samples,
summary,
settings
}=data;


const workbook =
new ExcelJS.Workbook();

workbook.creator =
"RNA质量检测工具";

workbook.created =
new Date();


const method = settings?.method || '硅胶膜柱提法'
const application = settings?.application || 'qPCR'
const appName = downstreamApplications[application]?.name || application




/*
=========================
Sheet1 样本数据
=========================
*/

const sheet1 =
workbook.addWorksheet("样本数据", {
views:[
{state:"frozen", ySplit:1}
]
});


sheet1.columns=[

{
header:"模板ID",
key:"id",
width:18
},

{
header:"RNA浓度(ng/μL)",
key:"concentration",
width:18
},

{
header:"A260/280",
key:"a280",
width:15
},

{
header:"A260/230",
key:"a230",
width:15
},

{
header:"RNA质量",
key:"quality",
width:12
},

{
header:"污染分析",
key:"pollution",
width:45
},

{
header:"建议",
key:"advice",
width:70
}

];



// 分析每个样本并添加行
samples

.filter(item=>!item.ignored)

.forEach(item=>{


const result =
analyzeRNA(item, method, application)


const row = sheet1.addRow({

id:item.id,

concentration:item.concentration ?? '',

a280:item.a260280 ?? '',

a230:item.a260230 ?? '',

quality:result.quality,

pollution:result.pollution,

advice:result.suggestion

});


// 质量列颜色标记
row.getCell(5).fill = {
type:"pattern",
pattern:"solid",
fgColor:{
argb: qualityColor(result.quality)
}
};


// 异常样本红色字体
if(result.quality === "较差"){
row.eachCell(cell=>{
cell.font = {
color:{argb:"C00000"}
};
});
}


// 内容自动换行
row.eachCell(cell=>{
cell.alignment = {
vertical:"top",
wrapText:true
};
});

});



// 表头样式
sheet1.getRow(1).eachCell(cell=>{

setCellStyle(cell, {
font:{
bold:true,
color:{argb:"FFFFFF"},
size:12
},
fill:"409EFF",
alignment:{
horizontal:"center",
vertical:"middle"
},
border:true
});

});

sheet1.getRow(1).height = 28;




/*
=========================
Sheet2 总结报告
=========================
*/

const sheet2 =
workbook.addWorksheet("总结报告", {
views:[
{state:"frozen", ySplit:3}
]
});


// 设置列宽（6列布局）
sheet2.columns=[
{width:22},
{width:25},
{width:25},
{width:25},
{width:25},
{width:25}
];



// 标题
sheet2.mergeCells("A1:F1");

const title =
sheet2.getCell("A1");

title.value =
"RNA质量检测实验报告";

setCellStyle(title, {
font:{
bold:true,
size:18,
color:{argb:"303133"}
},
alignment:{
horizontal:"center",
vertical:"middle"
}
});

sheet2.getRow(1).height = 40;



// 副标题（日期）
sheet2.mergeCells("A2:F2");

setCellStyle(sheet2.getCell("A2"), {
font:{
size:11,
color:{argb:"909399"}
},
alignment:{
horizontal:"center",
vertical:"middle"
}
});

sheet2.getCell("A2").value =
settings?.date || new Date().toLocaleDateString();

sheet2.getRow(2).height = 22;



// 第3行留空作为间隔
sheet2.addRow([]);
sheet2.getRow(3).height = 8;




/*
=========================
实验信息卡片
=========================
*/

sheet2.mergeCells("A4:F4");

setCellStyle(sheet2.getCell("A4"), {
font:{
bold:true,
color:{argb:"FFFFFF"}
},
fill:"409EFF",
alignment:{
horizontal:"left",
vertical:"middle"
}
});

sheet2.getCell("A4").value =
"实验信息";

sheet2.getRow(4).height = 24;



const info=[

[
"实验日期",
settings?.date || "未填写"
],

[
"实验人员",
settings?.operator || "未填写"
],

[
"RNA提取方法",
method
],

[
"实验用途",
appName
]

];

info.forEach(item=>{
const row = sheet2.addRow(item)
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
});




/*
=========================
提取及RT参数
=========================
*/

sheet2.addRow([]);

const rtParamStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${rtParamStartRow}:F${rtParamStartRow}`);

setCellStyle(sheet2.getCell(`A${rtParamStartRow}`), {
font:{
bold:true,
color:{argb:"FFFFFF"}
},
fill:"E6A23C",
alignment:{
horizontal:"left",
vertical:"middle"
}
});

sheet2.getCell(`A${rtParamStartRow}`).value =
"提取及RT参数";

sheet2.getRow(rtParamStartRow).height = 24;



const rtParams=[

[
"最大RNA上样量",
(settings?.maxRNA || 1000) + " ng"
],

[
"最小RNA上样量",
(settings?.minRNA || 10) + " ng"
],

[
"最大模板体积",
(settings?.maxVolume || 12) + " μL"
],

[
"推荐RT投入",
(summary?.rt?.recommendedRNA || 0) + " ng"
],

[
"RT模板体积范围",
(summary?.rt?.minVolume || 0) + " ~ " + (summary?.rt?.maxVolume || 0) + " μL"
],

[
"RT浓度状态",
summary?.rt?.level || "无法判断"
]

];

rtParams.forEach(item=>{
const row = sheet2.addRow(item)
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
});




/*
=========================
本次实验总体分析
=========================
*/

sheet2.addRow([]);

const analysisStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${analysisStartRow}:F${analysisStartRow}`);

setCellStyle(sheet2.getCell(`A${analysisStartRow}`), {
font:{
bold:true,
color:{argb:"FFFFFF"}
},
fill:"67C23A",
alignment:{
horizontal:"left",
vertical:"middle"
}
});

sheet2.getCell(`A${analysisStartRow}`).value =
"本次实验总体分析";

sheet2.getRow(analysisStartRow).height = 24;



const qc = summary?.qualityCount || {}

const analysisRows = [
["总样本数", summary?.totalCount || 0],
["有效样本数", summary?.validCount || 0],
["忽略样本数", summary?.ignoredCount || 0],
["平均浓度", (summary?.avgConcentration || 0) + " ng/μL"],
["总体质量", summary?.quality || "待检测"],
["优秀", (qc['优秀'] || 0) + " 个"],
["良好", (qc['良好'] || 0) + " 个"],
["一般", (qc['一般'] || 0) + " 个"],
["较差", (qc['较差'] || 0) + " 个"],
["待检测", (qc['待检测'] || 0) + " 个"]
];

analysisRows.forEach(item=>{
const row = sheet2.addRow(item)
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
});




/*
=========================
污染分析与提取优化建议
=========================
*/

sheet2.addRow([]);

const pollStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${pollStartRow}:F${pollStartRow}`);

setCellStyle(sheet2.getCell(`A${pollStartRow}`), {
font:{
bold:true,
color:{argb:"FFFFFF"}
},
fill:"F56C6C",
alignment:{
horizontal:"left",
vertical:"middle"
}
});

sheet2.getCell(`A${pollStartRow}`).value =
"污染分析与提取优化建议";

sheet2.getRow(pollStartRow).height = 24;



// 污染概况长文本（合并5行显示）
const pollTextRow = sheet2.rowCount + 1
sheet2.mergeCells(`A${pollTextRow}:F${pollTextRow + 4}`);

setCellStyle(sheet2.getCell(`A${pollTextRow}`), {
alignment:{
vertical:"top",
wrapText:true
}
});

sheet2.getCell(`A${pollTextRow}`).value =
summary?.pollution || "暂无数据";

sheet2.getRow(pollTextRow).height = 80;



// 预留合并区域行
for(let i = 0; i < 4; i++){
sheet2.addRow([]);
}



// 污染统计
const pc = summary?.pollutionCount || {}

const pollStatRows = [
["蛋白/酚类污染", (pc['蛋白或酚类污染'] || 0) + " 个"],
["盐类/试剂残留", (pc['盐类或试剂残留'] || 0) + " 个"],
["双重污染风险", (pc['双重污染风险'] || 0) + " 个"]
];

pollStatRows.forEach(item=>{
const row = sheet2.addRow(item)
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
});



// 异常样本列表
const pollutionSamples = summary?.pollutionSamples || []

if(pollutionSamples.length > 0){

sheet2.addRow([])

const abnRow = sheet2.rowCount + 1
sheet2.mergeCells(`A${abnRow}:F${abnRow}`)
setCellStyle(sheet2.getCell(`A${abnRow}`), {
font:{bold:true},
alignment:{vertical:"center"}
})
sheet2.getCell(`A${abnRow}`).value = "异常样本列表"

pollutionSamples.forEach(item=>{
const row = sheet2.addRow([
item.id,
item.pollution
])
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
})

}




/*
=========================
RT模板建议
=========================
*/

sheet2.addRow([]);

const rtStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${rtStartRow}:F${rtStartRow}`);

setCellStyle(sheet2.getCell(`A${rtStartRow}`), {
font:{
bold:true,
color:{argb:"FFFFFF"}
},
fill:"909399",
alignment:{
horizontal:"left",
vertical:"middle"
}
});

sheet2.getCell(`A${rtStartRow}`).value =
"RT模板建议";

sheet2.getRow(rtStartRow).height = 24;



if(summary?.rt?.message){
const row = sheet2.addRow([
"RT策略说明",
summary.rt.message
])
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
}

if(summary?.rt?.suggestion){
const row = sheet2.addRow([
"RT建议",
summary.rt.suggestion
])
row.eachCell(cell=>{
setCellStyle(cell, {
alignment:{vertical:"center", wrapText:true}
})
})
}

if(summary?.rtWarning){
const row = sheet2.addRow([
"浓度差异警告",
summary.rtWarning
])
row.eachCell(cell=>{
setCellStyle(cell, {
font:{color:{argb:"E6A23C"}},
alignment:{vertical:"center", wrapText:true}
})
})
}




/*
=========================
图表插入
=========================
*/

// RNA质量分布图
sheet2.addRow([]);

const chartRow1 = sheet2.rowCount + 1
sheet2.mergeCells(`A${chartRow1}:F${chartRow1}`)
setCellStyle(sheet2.getCell(`A${chartRow1}`), {
font:{bold:true, size:14},
alignment:{horizontal:"left", vertical:"middle"}
})
sheet2.getCell(`A${chartRow1}`).value = "RNA质量分布"
sheet2.getRow(chartRow1).height = 24

if(charts?.quality){
const qualityBase64 = charts.quality.replace(/^data:image\/png;base64,/, '')
const imageId1 = workbook.addImage({
base64: qualityBase64,
extension: "png"
})
sheet2.addImage(imageId1, {
tl: {col:0, row:chartRow1},
ext: {width:550, height:300}
})
// 预留图片空间（16行）
for(let i = 0; i < 16; i++){
sheet2.addRow([])
}
}

// 污染类型分析图
sheet2.addRow([]);

const chartRow2 = sheet2.rowCount + 1
sheet2.mergeCells(`A${chartRow2}:F${chartRow2}`)
setCellStyle(sheet2.getCell(`A${chartRow2}`), {
font:{bold:true, size:14},
alignment:{horizontal:"left", vertical:"middle"}
})
sheet2.getCell(`A${chartRow2}`).value = "污染类型分析"
sheet2.getRow(chartRow2).height = 24

if(charts?.pollution){
const pollutionBase64 = charts.pollution.replace(/^data:image\/png;base64,/, '')
const imageId2 = workbook.addImage({
base64: pollutionBase64,
extension: "png"
})
sheet2.addImage(imageId2, {
tl: {col:0, row:chartRow2},
ext: {width:550, height:300}
})
}




/*
=========================
打印格式与页眉页脚
=========================
*/

// Sheet1 打印
sheet1.pageSetup = {
paperSize:9,
orientation:"portrait",
fitToPage:true,
fitToWidth:1,
fitToHeight:0
};

sheet1.headerFooter = {
oddHeader:"&C RNA质量检测报告 - 样本数据",
oddFooter:"&C 第 &P 页 / 共 &N 页"
};


// Sheet2 打印
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




/*
=========================
自动行高
=========================
*/

autoRowHeight(sheet1);
autoRowHeight(sheet2);




// 导出
const buffer =
await workbook.xlsx.writeBuffer();



saveAs(

new Blob(
[
buffer
],
{
type:
"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
),

"RNA质量检测报告.xlsx"

);


}

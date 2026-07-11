import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { analyzeRNA } from "../core/RNAQuality";
import { extractionMethods } from "../config/extractionAdvice";
import { downstreamApplications } from "../config/downstreamApplication";


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




/*
=========================
Sheet1 样本数据
=========================
*/


const sheet1 =
workbook.addWorksheet(
"样本数据"
);



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
const method = settings?.method || '硅胶膜柱提法'
const application = settings?.application || 'qPCR'

samples

.filter(
item=>!item.ignored
)

.forEach(
item=>{


const result =
analyzeRNA(item, method, application)


sheet1.addRow({

id:item.id,

concentration:item.concentration ?? '',

a280:item.a260280 ?? '',

a230:item.a260230 ?? '',

quality:result.quality,

pollution:result.pollution,

advice:result.suggestion


});


}

);






// 表头样式

sheet1.getRow(1).eachCell(
cell=>{


cell.font={

bold:true,

color:{
argb:"FFFFFF"
},

size:12
}


cell.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"409EFF"
}

}


cell.alignment={

horizontal:"center",

vertical:"middle"

}



}

);


sheet1.getRow(1).height = 28;




// 内容自动换行 + 质量标签颜色

sheet1.eachRow(
(row, rowNum)=>{


if(rowNum === 1) return


row.eachCell(
(cell, colNumber)=>{


cell.alignment={


vertical:"top",

wrapText:true


};


// 质量列着色
if(colNumber === 5){
    const val = cell.value
    if(val === '优秀'){
        cell.fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{argb:"E1F3D8"}
        }
    } else if(val === '良好'){
        cell.fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{argb:"F0F9EB"}
        }
    } else if(val === '一般'){
        cell.fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{argb:"FAECD8"}
        }
    } else if(val === '较差'){
        cell.fill = {
            type:"pattern",
            pattern:"solid",
            fgColor:{argb:"FDE2E2"}
        }
    }
}


}

);


}

);








/*
=========================
Sheet2 总结报告
=========================
*/


const sheet2 =
workbook.addWorksheet(
"总结报告"
);



// 设置列宽

sheet2.columns=[

{
width:22
},

{
width:25
},

{
width:25
},

{
width:25
}


];



// 标题

sheet2.mergeCells(
"A1:D1"
);


const title =
sheet2.getCell(
"A1"
);


title.value=
"RNA质量检测实验总结报告";



title.font={

bold:true,

size:18,
color:{argb:"303133"}

};



title.alignment={

horizontal:"center",

vertical:"middle"

};


sheet2.getRow(1).height = 40;






/*
=========================
实验管理模块
=========================
*/


sheet2.mergeCells(
"A3:D3"
);



const mgmtTitle = sheet2.getCell(
"A3"
)
mgmtTitle.value=
"实验管理模块";



mgmtTitle.font={

bold:true,

color:{
argb:"FFFFFF"
}

};


mgmtTitle.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"67C23A"
}

};


mgmtTitle.alignment = {
horizontal:"left",
vertical:"middle"
}


sheet2.getRow(3).height = 24




const appName = downstreamApplications[application]?.name || application

const management=[


[
"实验日期",
settings?.date || new Date().toLocaleDateString()
],


[
"操作者",
settings?.operator || ""
],


[
"RNA提取方法",
method
],


[
"下游实验用途",
appName
]


];



management.forEach(item=>{


sheet2.addRow(item);


});









/*
=========================
提取及RT参数
=========================
*/


sheet2.addRow([]);




const rtParamStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${rtParamStartRow}:D${rtParamStartRow}`);



const rtTitle = sheet2.getCell(`A${rtParamStartRow}`)


rtTitle.value=
"提取及RT参数";



rtTitle.font={

bold:true,

color:{
argb:"FFFFFF"
}

};


rtTitle.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"E6A23C"
}

};


rtTitle.alignment = {
horizontal:"left",
vertical:"middle"
}


sheet2.getRow(rtParamStartRow).height = 24





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





rtParams.forEach(
item=>{

sheet2.addRow(item);

}

);







/*
=========================
实验总体分析
=========================
*/


sheet2.addRow([]);



const analysisStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${analysisStartRow}:D${analysisStartRow}`);



const analysisTitle = sheet2.getCell(`A${analysisStartRow}`)


analysisTitle.value=
"实验总体分析";



analysisTitle.font={

bold:true,

color:{
argb:"FFFFFF"
}

};


analysisTitle.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"409EFF"
}

};


analysisTitle.alignment = {
horizontal:"left",
vertical:"middle"
}


sheet2.getRow(analysisStartRow).height = 24




const qc = summary?.qualityCount || {}

sheet2.addRow([

"总样本数",

summary?.totalCount || 0

]);



sheet2.addRow([

"有效样本数",

summary?.validCount || 0

]);



sheet2.addRow([

"忽略样本数",

summary?.ignoredCount || 0

]);



sheet2.addRow([

"平均浓度",

(summary?.avgConcentration || 0) + " ng/μL"

]);



sheet2.addRow([

"总体质量",

summary?.quality || "待检测"

]);



sheet2.addRow([

"优秀",

(qc['优秀'] || 0) + " 个"

]);



sheet2.addRow([

"良好",

(qc['良好'] || 0) + " 个"

]);



sheet2.addRow([

"一般",

(qc['一般'] || 0) + " 个"

]);



sheet2.addRow([

"较差",

(qc['较差'] || 0) + " 个"

]);




sheet2.addRow([]);



sheet2.addRow([

"待检测",

(qc['待检测'] || 0) + " 个"

]);




sheet2.addRow([]);




/*
=========================
污染分析
=========================
*/


const pollStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${pollStartRow}:D${pollStartRow}`);



const pollTitle = sheet2.getCell(`A${pollStartRow}`)


pollTitle.value=
"污染分析";



pollTitle.font={

bold:true,

color:{
argb:"FFFFFF"
}

};


pollTitle.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"F56C6C"
}

};


pollTitle.alignment = {
horizontal:"left",
vertical:"middle"
}


sheet2.getRow(pollStartRow).height = 24




sheet2.addRow([

"污染概况",

summary?.pollution || "暂无数据"

]);




const pc = summary?.pollutionCount || {}

sheet2.addRow([

"蛋白/酚类污染",

(pc['蛋白或酚类污染'] || 0) + " 个"

]);



sheet2.addRow([

"盐类/试剂残留",

(pc['盐类或试剂残留'] || 0) + " 个"

]);



sheet2.addRow([

"双重污染风险",

(pc['双重污染风险'] || 0) + " 个"

]);




// 异常样本列表
const pollutionSamples = summary?.pollutionSamples || []

if(pollutionSamples.length > 0){

    sheet2.addRow([])

    sheet2.addRow(["异常样本列表"])


    pollutionSamples.forEach(item=>{

        sheet2.addRow([

            item.id,

            item.pollution

        ])

    })

}




/*
=========================
RT模板建议
=========================
*/


sheet2.addRow([]);



const rtStartRow = sheet2.rowCount + 1

sheet2.mergeCells(`A${rtStartRow}:D${rtStartRow}`);



const rtTitle2 = sheet2.getCell(`A${rtStartRow}`)


rtTitle2.value=
"RT模板建议";



rtTitle2.font={

bold:true,

color:{
argb:"FFFFFF"
}

};


rtTitle2.fill={

type:"pattern",

pattern:"solid",

fgColor:{
argb:"909399"
}

};


rtTitle2.alignment = {
horizontal:"left",
vertical:"middle"
}


sheet2.getRow(rtStartRow).height = 24




if(summary?.rt?.message){

    sheet2.addRow([

        "RT策略说明",

        summary.rt.message

    ])

}


if(summary?.rtWarning){

    sheet2.addRow([

        "浓度差异警告",

        summary.rtWarning

    ])

}




/*
=========================
图表插入
=========================
*/

// RNA质量分布图
sheet2.addRow([]);

const chartRow1 = sheet2.rowCount + 1
sheet2.mergeCells(`A${chartRow1}:D${chartRow1}`)
const chartTitle1 = sheet2.getCell(`A${chartRow1}`)
chartTitle1.value = "RNA质量分布"
chartTitle1.font = {bold:true, size:14}
sheet2.getRow(chartRow1).height = 24

if(charts?.quality){
    const qualityBase64 = charts.quality.replace(/^data:image\/png;base64,/, '')
    const imageId1 = workbook.addImage({
        base64: qualityBase64,
        extension: "png"
    })
    sheet2.addImage(imageId1, {
        tl: {col:0, row:chartRow1},
        ext: {width:500, height:300}
    })
    // 预留图片空间（15行）
    for(let i = 0; i < 15; i++){
        sheet2.addRow([])
    }
}

// 污染类型分析图
sheet2.addRow([]);

const chartRow2 = sheet2.rowCount + 1
sheet2.mergeCells(`A${chartRow2}:D${chartRow2}`)
const chartTitle2 = sheet2.getCell(`A${chartRow2}`)
chartTitle2.value = "污染类型分析"
chartTitle2.font = {bold:true, size:14}
sheet2.getRow(chartRow2).height = 24

if(charts?.pollution){
    const pollutionBase64 = charts.pollution.replace(/^data:image\/png;base64,/, '')
    const imageId2 = workbook.addImage({
        base64: pollutionBase64,
        extension: "png"
    })
    sheet2.addImage(imageId2, {
        tl: {col:0, row:chartRow2},
        ext: {width:500, height:300}
    })
}




// 所有单元格换行

sheet2.eachRow(
row=>{


row.eachCell(
cell=>{


if(!cell.alignment || !cell.alignment.wrapText){

cell.alignment={

vertical:"top",

wrapText:true

};

}



}

);


}

);





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

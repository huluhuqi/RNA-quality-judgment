/**
 * Excel 样式工具
 *
 * 统一管理颜色、字体、边框、行高。
 */


/**
 * 颜色主题
 */
export const ExcelTheme = {
    title: "409EFF",
    subtitle: "303133",
    headerBg: "409EFF",
    qualityExcellent: "C6E0B4",
    qualityGood: "DDEBF7",
    qualityNormal: "FFF2CC",
    qualityPoor: "F4CCCC",
    sectionGreen: "67C23A",
    sectionOrange: "E6A23C",
    sectionBlue: "409EFF",
    sectionRed: "F56C6C",
    sectionGray: "909399",
    danger: "C00000"
};


/**
 * 全局单元格样式设置
 */
export function setCellStyle(cell, options={}){
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
export function qualityColor(quality){
    switch(quality){
        case "优秀": return ExcelTheme.qualityExcellent;
        case "良好": return ExcelTheme.qualityGood;
        case "一般": return ExcelTheme.qualityNormal;
        case "较差": return ExcelTheme.qualityPoor;
        default: return "FFFFFF";
    }
}


/**
 * 自动行高（基于内容长度估算）
 */
export function autoRowHeight(sheet){
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

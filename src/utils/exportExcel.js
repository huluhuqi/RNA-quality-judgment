/**
 * 兼容入口
 *
 * 核心逻辑已迁移至 src/utils/export/：
 *   - export/formatExportData.js  数据格式化（读取 sample.result）
 *   - export/excel/excelStyle.js  样式工具
 *   - export/excel/excelContent.js Sheet 构建
 *   - export/excel/index.js       Excel 主入口
 *
 * 本文件保留以兼容旧 import：
 *   import { exportRNAReport } from '../utils/exportExcel'
 */
import { exportExcel } from "./export";

export async function exportRNAReport(data, charts){
    await exportExcel(data, charts);
}

export default exportRNAReport;

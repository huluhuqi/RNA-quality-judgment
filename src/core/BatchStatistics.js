/**
 * 兼容入口
 *
 * 核心逻辑已拆分至 src/core/statistics/：
 *   - sampleStatistics.js    质量与浓度统计
 *   - pollutionStatistics.js 污染统计
 *   - summaryBuilder.js      总体评价与应用分析
 *   - chartDataBuilder.js    图表数据
 *
 * 本文件保留以兼容旧 import：
 *   import { calculateBatch } from '../core/BatchStatistics'
 */
import { calculateBatch } from "./statistics";

export { calculateBatch };
export default calculateBatch;

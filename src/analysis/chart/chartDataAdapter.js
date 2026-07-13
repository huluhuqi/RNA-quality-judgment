/**
 * 图表数据统一适配器
 *
 * 所有 ECharts 图表组件必须通过此模块获取绘图数据源，
 * 禁止直接读取 store.samples 或 props.samples。
 *
 * 统一规则：
 *   被忽略的样本不参与任何图表展示。
 */
import { getActiveSamples } from "@/utils/sampleFilter";

/**
 * 获取用于图表的有效样本
 * @param {Array} samples 全部样本
 * @returns {Array} 有效样本（排除被忽略的）
 */
export function getChartSamples(samples) {
    return getActiveSamples(samples);
}

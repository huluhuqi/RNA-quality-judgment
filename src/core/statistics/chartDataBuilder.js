/**
 * ECharts 图表数据构建
 *
 * 直接使用 qualityCount / pollutionCount 作为图表数据，
 * 与 QualityChart.vue / PollutionChart.vue 的 props.data 读取的 key 保持一致。
 */


export function buildQualityChartData(qualityCount){
    return qualityCount;
}


export function buildPollutionChartData(pollutionCount){
    return pollutionCount;
}

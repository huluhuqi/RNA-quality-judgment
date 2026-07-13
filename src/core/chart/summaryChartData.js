/**
 * 批次总结图表数据生成
 *
 * 为ECharts提供标准化的数据格式，
 * 数据来源：batchSummary 批次总结结果。
 */


/**
 * RNA质量分布图表数据
 */
export function qualityChartData(summary) {

    return {

        legend: [
            "优秀",
            "良好",
            "一般",
            "较差",
            "不合格"
        ],

        data: [
            summary.quality.excellent,
            summary.quality.good,
            summary.quality.warning,
            summary.quality.poor,
            summary.quality.fail
        ],

        colors: [
            "#67c23a",
            "#409eff",
            "#e6a23c",
            "#f56c6c",
            "#909399"
        ]

    };

}


/**
 * 污染类型统计图表数据
 */
export function pollutionChartData(summary) {

    return Object.entries(summary.pollution)
        .map(item => ({
            name: item[0],
            value: item[1]
        }))
        .sort((a, b) => b.value - a.value);

}


/**
 * 提取问题统计图表数据
 */
export function extractionChartData(summary) {

    return Object.entries(summary.extraction)
        .map(item => ({
            name: item[0],
            value: item[1]
        }))
        .sort((a, b) => b.value - a.value);

}


/**
 * RT推荐统计图表数据
 */
export function rtChartData(summary) {

    return [
        { name: "可推荐", value: summary.rt.recommend },
        { name: "无法推荐", value: summary.rt.cannot }
    ];

}

/**
 * ECharts 图表模块统一入口
 *
 * 提供图表管理、主题、配置的统一导出
 */

// 图表实例管理
export {
    createChart,
    getChart,
    hasChart,
    resizeChart,
    resizeAllCharts,
    disposeChart,
    disposeAllCharts,
    updateAllChartsTheme,
    addResizeCallback,
    removeResizeCallback,
    getChartCount,
    exportChartImage
} from './chartManager';

// 主题管理
export {
    getChartTheme,
    getChartBgColor,
    getChartTextColor,
    isDarkMode,
    getCurrentTheme,
    getCurrentChartTheme,
    QUALITY_COLORS,
    POLLUTION_COLORS,
    getQualityDistributionColors,
    getPollutionColors
} from './chartTheme';

// 配置生成
export {
    qualityDistributionOption,
    pollutionBarOption,
    extractionProblemOption,
    aggregateData,
    getResponsiveFontSize
} from './chartOption';
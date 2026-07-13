/**
 * ECharts 图表配置生成器
 *
 * 统一生成各类图表的配置选项
 * 支持主题适配和数据聚合
 */
import { getChartTheme, getQualityDistributionColors, getPollutionColors } from './chartTheme';

/**
 * 生成 RNA 质量分布饼图配置
 * 
 * @param {Object} data 质量统计数据 { excellent, good, warning, poor, fail }
 * @param {string} theme 主题名称
 * @returns {Object} ECharts 配置对象
 */
export function qualityDistributionOption(data, theme = 'light') {
    const themeConfig = getChartTheme(theme);
    
    const chartData = [
        { value: data.excellent || 0, name: '优秀' },
        { value: data.good || 0, name: '良好' },
        { value: data.warning || 0, name: '一般' },
        { value: data.poor || 0, name: '较差' },
        { value: data.fail || 0, name: '不合格' }
    ].filter(item => item.value > 0);
    
    return {
        backgroundColor: themeConfig.backgroundColor,
        title: {
            text: 'RNA质量分布',
            left: 'center',
            ...themeConfig.title
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)',
            ...themeConfig.tooltip
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            bottom: '8%',
            ...themeConfig.legend
        },
        series: [{
            name: '质量分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '55%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 10,
                borderColor: themeConfig.backgroundColor,
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {c} ({d}%)',
                color: themeConfig.textStyle.color
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: true
            },
            data: chartData,
            color: getQualityDistributionColors()
        }]
    };
}

/**
 * 生成污染分析柱状图配置
 * 
 * @param {Object} data 污染统计数据 { 污染类型: 数量 }
 * @param {string} theme 主题名称
 * @returns {Object} ECharts 配置对象
 */
export function pollutionBarOption(data, theme = 'light') {
    const themeConfig = getChartTheme(theme);
    
    const categories = Object.keys(data);
    const values = Object.values(data);
    
    return {
        backgroundColor: themeConfig.backgroundColor,
        title: {
            text: '污染类型统计',
            left: 'center',
            ...themeConfig.title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            ...themeConfig.tooltip
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
                color: themeConfig.axisLabel.color,
                rotate: categories.length > 5 ? 30 : 0
            },
            axisLine: themeConfig.axisLine
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: themeConfig.axisLabel.color
            },
            axisLine: themeConfig.axisLine,
            splitLine: themeConfig.splitLine
        },
        series: [{
            name: '样本数',
            type: 'bar',
            barWidth: '60%',
            data: values,
            itemStyle: {
                color: '#409eff',
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };
}

/**
 * 生成提取问题柱状图配置
 * 
 * @param {Object} data 提取问题统计数据
 * @param {string} theme 主题名称
 * @returns {Object} ECharts 配置对象
 */
export function extractionProblemOption(data, theme = 'light') {
    const themeConfig = getChartTheme(theme);
    
    // 转换为数组并按数量排序
    const sortedData = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // 只显示前10个
    
    const categories = sortedData.map(item => item[0]);
    const values = sortedData.map(item => item[1]);
    
    return {
        backgroundColor: themeConfig.backgroundColor,
        title: {
            text: '提取流程问题统计',
            left: 'center',
            ...themeConfig.title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            ...themeConfig.tooltip
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                color: themeConfig.axisLabel.color
            },
            axisLine: themeConfig.axisLine,
            splitLine: themeConfig.splitLine
        },
        yAxis: {
            type: 'category',
            data: categories.reverse(),
            axisLabel: {
                color: themeConfig.axisLabel.color
            },
            axisLine: themeConfig.axisLine
        },
        series: [{
            name: '样本数',
            type: 'bar',
            barWidth: '60%',
            data: values.reverse(),
            itemStyle: {
                color: '#e6a23c',
                borderRadius: [0, 4, 4, 0]
            }
        }]
    };
}

/**
 * 聚合大数据（用于大数据量图表优化）
 * 
 * @param {Array} data 原始数据数组
 * @param {string} key 统计字段名
 * @returns {Object} 聚合后的统计对象
 */
export function aggregateData(data, key) {
    const result = {};
    
    data.forEach(item => {
        const value = item[key] || item.result?.[key] || 'unknown';
        result[value] = (result[value] || 0) + 1;
    });
    
    return result;
}

/**
 * 生成响应式字体大小
 * 
 * @param {number} base 基础字体大小
 * @param {number} containerWidth 容器宽度
 * @returns {number} 计算后的字体大小
 */
export function getResponsiveFontSize(base, containerWidth) {
    if (containerWidth < 400) {
        return Math.max(10, base - 2);
    }
    return base;
}
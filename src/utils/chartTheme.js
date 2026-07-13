/**
 * ECharts 主题工具
 * 
 * 根据当前主题模式动态设置图表样式
 */

export function getChartTheme(dark) {
    return {
        backgroundColor: dark ? "#1e1e1e" : "#ffffff",
        textStyle: {
            color: dark ? "#ffffff" : "#303133"
        },
        title: {
            textStyle: {
                color: dark ? "#ffffff" : "#303133"
            }
        },
        legend: {
            textStyle: {
                color: dark ? "#a0a0a0" : "#606266"
            }
        },
        tooltip: {
            backgroundColor: dark ? "#2a2a2a" : "#ffffff",
            textStyle: {
                color: dark ? "#ffffff" : "#303133"
            },
            borderColor: dark ? "#444" : "#e4e7ed"
        },
        axisLine: {
            lineStyle: {
                color: dark ? "#444" : "#dcdfe6"
            }
        },
        splitLine: {
            lineStyle: {
                color: dark ? "#2a2a2a" : "#f0f0f0"
            }
        },
        axisLabel: {
            color: dark ? "#a0a0a0" : "#606266"
        }
    };
}

export function getChartBgColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--chart-bg').trim();
}

export function getChartTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--chart-text').trim();
}

export function isDarkMode() {
    return document.documentElement.classList.contains('dark');
}

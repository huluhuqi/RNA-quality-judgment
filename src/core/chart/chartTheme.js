/**
 * ECharts 图表主题管理
 *
 * 统一定义图表的主题样式，支持浅色/深色主题切换
 * 与项目 CSS 变量系统保持一致
 */

/**
 * 获取图表主题配置
 * 
 * @param {string} theme 主题名称 'light' | 'dark'
 * @returns {Object} ECharts 主题配置对象
 */
export function getChartTheme(theme) {
    const isDark = theme === 'dark';
    
    return {
        // 背景色
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        
        // 文字样式
        textStyle: {
            color: isDark ? '#ffffff' : '#303133'
        },
        
        // 标题样式
        title: {
            textStyle: {
                color: isDark ? '#ffffff' : '#303133',
                fontSize: 16,
                fontWeight: 600
            },
            subtextStyle: {
                color: isDark ? '#a0a0a0' : '#909399'
            }
        },
        
        // 图例样式
        legend: {
            textStyle: {
                color: isDark ? '#a0a0a0' : '#606266'
            },
            pageTextStyle: {
                color: isDark ? '#a0a0a0' : '#606266'
            }
        },
        
        // 提示框样式
        tooltip: {
            backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
            borderColor: isDark ? '#444444' : '#e4e7ed',
            textStyle: {
                color: isDark ? '#ffffff' : '#303133'
            }
        },
        
        // 坐标轴样式
        axisLine: {
            lineStyle: {
                color: isDark ? '#444444' : '#dcdfe6'
            }
        },
        
        // 分隔线样式
        splitLine: {
            lineStyle: {
                color: isDark ? '#333333' : '#f0f0f0'
            }
        },
        
        // 坐标轴标签
        axisLabel: {
            color: isDark ? '#a0a0a0' : '#606266'
        }
    };
}

/**
 * 获取图表背景色
 * 
 * @param {string} theme 主题名称
 * @returns {string} 背景色值
 */
export function getChartBgColor(theme) {
    return theme === 'dark' ? '#1e1e1e' : '#ffffff';
}

/**
 * 获取图表文字颜色
 * 
 * @param {string} theme 主题名称
 * @returns {string} 文字颜色值
 */
export function getChartTextColor(theme) {
    return theme === 'dark' ? '#ffffff' : '#303133';
}

/**
 * 判断是否为深色主题
 * 
 * @returns {boolean}
 */
export function isDarkMode() {
    return document.documentElement.classList.contains('dark');
}

/**
 * 获取当前主题名称
 * 
 * @returns {string} 'light' | 'dark'
 */
export function getCurrentTheme() {
    return isDarkMode() ? 'dark' : 'light';
}

/**
 * 获取当前主题的图表配置
 * 
 * @returns {Object}
 */
export function getCurrentChartTheme() {
    return getChartTheme(getCurrentTheme());
}

/**
 * RNA 质量等级颜色配置
 */
export const QUALITY_COLORS = {
    excellent: '#67c23a',  // 优秀 - 绿色
    good: '#409eff',       // 良好 - 蓝色
    warning: '#e6a23c',    // 一般 - 橙色
    poor: '#f56c6c',       // 较差 - 红色
    fail: '#909399'        // 不合格 - 灰色
};

/**
 * 污染类型颜色配置
 */
export const POLLUTION_COLORS = {
    protein: '#e74c3c',    // 蛋白/酚类污染
    salt: '#f39c12',       // 盐类/试剂残留
    dual: '#8e44ad',       // 双重污染风险
    none: '#67c23a'        // 无污染
};

/**
 * 获取质量分布图颜色数组
 * 
 * @returns {Array<string>}
 */
export function getQualityDistributionColors() {
    return [
        QUALITY_COLORS.excellent,
        QUALITY_COLORS.good,
        QUALITY_COLORS.warning,
        QUALITY_COLORS.poor,
        QUALITY_COLORS.fail
    ];
}

/**
 * 获取污染分析图颜色数组
 * 
 * @returns {Array<string>}
 */
export function getPollutionColors() {
    return [
        '#e74c3c',
        '#f39c12',
        '#3498db',
        '#9b59b6',
        '#1abc9c'
    ];
}
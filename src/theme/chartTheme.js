/**
 * ECharts 图表主题
 *
 * 统一读取 CSS 变量，保证图表颜色随主题切换。
 * 图表组件调用 getChartTheme() 获取主题色，并在 theme-change 事件时重渲染。
 */

/**
 * 读取指定 CSS 变量的值
 *
 * @param {string} varName CSS 变量名（如 '--chart-text'）
 * @param {string} fallback 取不到时的回退值
 * @returns {string} 颜色值
 */
function readVar(varName, fallback = ""){
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
    return value || fallback;
}


/**
 * 获取图表文字颜色
 *
 * @returns {string}
 */
export function getChartTextColor(){
    return readVar('--chart-text', '#303133');
}


/**
 * 获取图表背景颜色
 *
 * @returns {string}
 */
export function getChartBgColor(){
    return readVar('--chart-bg', '#ffffff');
}


/**
 * 获取 ECharts 主题配置片段
 *
 * 用于合并到 setOption 中：
 *   chart.setOption({ ...getChartTheme(), series: [...] })
 *
 * @returns {Object} 含 backgroundColor 与 textStyle
 */
export function getChartTheme(){
    return {
        backgroundColor: 'transparent',
        textStyle: {
            color: getChartTextColor()
        }
    };
}

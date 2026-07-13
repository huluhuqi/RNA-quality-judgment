/**
 * ECharts 图表实例管理
 *
 * 统一管理所有图表实例，避免重复初始化和内存泄漏
 * 
 * 功能：
 * - 单例模式：每个图表只创建一次
 * - 统一销毁：防止内存泄漏
 * - 统一 resize：窗口变化时自动调整
 * - 主题切换：统一更新所有图表主题
 */
import * as echarts from 'echarts';

// 图表实例存储
const instances = new Map();

// resize 回调集合
const resizeCallbacks = new Set();

// resize 防抖定时器
let resizeTimer = null;

/**
 * 创建或获取图表实例
 * 
 * @param {string} id 图表唯一标识
 * @param {HTMLElement} dom DOM 容器
 * @param {string} theme 主题名称（可选）
 * @returns {Object} ECharts 实例
 */
export function createChart(id, dom, theme = null) {
    // 已存在则返回现有实例
    if (instances.has(id)) {
        return instances.get(id);
    }
    
    // 创建新实例
    const chart = echarts.init(dom, theme);
    instances.set(id, chart);
    
    return chart;
}

/**
 * 获取图表实例
 * 
 * @param {string} id 图表唯一标识
 * @returns {Object|null} ECharts 实例
 */
export function getChart(id) {
    return instances.get(id) || null;
}

/**
 * 判断图表实例是否存在
 * 
 * @param {string} id 图表唯一标识
 * @returns {boolean}
 */
export function hasChart(id) {
    return instances.has(id);
}

/**
 * 调整图表尺寸
 * 
 * @param {string} id 图表唯一标识
 * @param {Object} options resize 选项
 */
export function resizeChart(id, options = {}) {
    const chart = instances.get(id);
    if (chart) {
        chart.resize(options);
    }
}

/**
 * 调整所有图表尺寸
 */
export function resizeAllCharts() {
    instances.forEach(chart => {
        try {
            chart.resize();
        } catch (e) {
            console.warn('图表 resize 失败:', e);
        }
    });
}

/**
 * 销毁单个图表实例
 * 
 * @param {string} id 图表唯一标识
 */
export function disposeChart(id) {
    const chart = instances.get(id);
    if (chart) {
        try {
            chart.dispose();
        } catch (e) {
            console.warn('图表销毁失败:', e);
        }
        instances.delete(id);
    }
}

/**
 * 销毁所有图表实例
 */
export function disposeAllCharts() {
    instances.forEach((chart, id) => {
        try {
            chart.dispose();
        } catch (e) {
            console.warn(`图表 ${id} 销毁失败:`, e);
        }
    });
    instances.clear();
}

/**
 * 更新所有图表主题
 * 
 * @param {Object} theme 主题配置对象
 */
export function updateAllChartsTheme(theme) {
    instances.forEach(chart => {
        try {
            // 获取当前配置
            const option = chart.getOption();
            // 合并新主题
            chart.setOption({
                ...option,
                ...theme
            }, { notMerge: false });
        } catch (e) {
            console.warn('更新图表主题失败:', e);
        }
    });
}

/**
 * 添加 resize 监听
 * 
 * @param {Function} callback 回调函数
 */
export function addResizeCallback(callback) {
    resizeCallbacks.add(callback);
}

/**
 * 移除 resize 监听
 * 
 * @param {Function} callback 回调函数
 */
export function removeResizeCallback(callback) {
    resizeCallbacks.delete(callback);
}

/**
 * 处理窗口 resize（带防抖）
 */
function handleResize() {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    
    resizeTimer = setTimeout(() => {
        resizeAllCharts();
        resizeCallbacks.forEach(fn => {
            try {
                fn();
            } catch (e) {
                console.warn('resize 回调执行失败:', e);
            }
        });
    }, 100);
}

// 监听窗口 resize
if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
}

/**
 * 获取所有图表实例数量
 * 
 * @returns {number}
 */
export function getChartCount() {
    return instances.size;
}

/**
 * 导出图表为图片
 * 
 * @param {string} id 图表唯一标识
 * @param {Object} options 导出选项
 * @returns {string} 图片 Data URL
 */
export function exportChartImage(id, options = {}) {
    const chart = instances.get(id);
    if (!chart) {
        return null;
    }
    
    return chart.getDataURL({
        type: 'png',
        pixelRatio: 3, // 高清导出
        backgroundColor: options.backgroundColor || '#fff',
        ...options
    });
}
<script setup>
/**
 * BaseChart - 通用 ECharts 图表组件
 *
 * 功能：
 * - 统一的图表生命周期管理
 * - 自动 resize
 * - 主题切换支持
 * - 防抖更新
 * - 高清导出
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick, markRaw } from 'vue';
import {
    createChart,
    disposeChart,
    resizeChart,
    exportChartImage,
    getCurrentTheme,
    getChartTheme
} from '@/core/chart';
import { debounce } from '@/utils/debounce';

const props = defineProps({
    // 图表唯一标识（必填）
    id: {
        type: String,
        required: true
    },
    // 图表配置
    option: {
        type: Object,
        default: () => ({})
    },
    // 是否自动 resize
    autoResize: {
        type: Boolean,
        default: true
    },
    // 图表高度
    height: {
        type: [Number, String],
        default: 300
    },
    // 图表宽度
    width: {
        type: [Number, String],
        default: '100%'
    },
    // 防抖延迟（毫秒）
    debounceTime: {
        type: Number,
        default: 100
    }
});

const emit = defineEmits(['ready', 'error']);

// DOM 引用
const chartRef = ref(null);

// 图表实例（使用 markRaw 避免响应式）
let chartInstance = null;

// 防抖更新函数
const debouncedUpdate = debounce((option) => {
    if (chartInstance && option) {
        try {
            chartInstance.setOption(option, { notMerge: false });
        } catch (e) {
            console.error('图表更新失败:', e);
        }
    }
}, props.debounceTime);

/**
 * 初始化图表
 */
function initChart() {
    if (!chartRef.value) return;
    
    try {
        const theme = getCurrentTheme();
        chartInstance = createChart(props.id, chartRef.value, theme);
        
        // 使用 markRaw 避免响应式追踪
        chartInstance = markRaw(chartInstance);
        
        // 设置初始配置
        if (props.option && Object.keys(props.option).length > 0) {
            chartInstance.setOption(props.option);
        }
        
        emit('ready', chartInstance);
    } catch (e) {
        console.error('图表初始化失败:', e);
        emit('error', e);
    }
}

/**
 * 更新图表配置
 */
function updateChart(option) {
    if (!chartInstance) return;
    
    debouncedUpdate(option);
}

/**
 * 手动触发 resize
 */
function handleResize() {
    if (props.autoResize) {
        resizeChart(props.id);
    }
}

/**
 * 导出图表为图片
 */
function exportImage(options = {}) {
    return exportChartImage(props.id, {
        pixelRatio: 3,
        backgroundColor: getCurrentTheme() === 'dark' ? '#1e1e1e' : '#ffffff',
        ...options
    });
}

/**
 * 获取图表实例
 */
function getChartInstance() {
    return chartInstance;
}

// 监听配置变化
watch(
    () => props.option,
    (newOption) => {
        if (newOption) {
            updateChart(newOption);
        }
    },
    { deep: true }
);

// 监听主题变化
watch(
    () => getCurrentTheme(),
    (newTheme) => {
        if (chartInstance && props.option) {
            const themeConfig = getChartTheme(newTheme);
            chartInstance.setOption({
                ...props.option,
                ...themeConfig
            });
        }
    }
);

// 组件挂载
onMounted(() => {
    nextTick(() => {
        initChart();
    });
});

// 组件卸载
onBeforeUnmount(() => {
    disposeChart(props.id);
    chartInstance = null;
});

// 暴露方法给父组件
defineExpose({
    resize: handleResize,
    exportImage,
    getInstance: getChartInstance
});
</script>

<template>
<div
    ref="chartRef"
    class="base-chart"
    :style="{
        height: typeof height === 'number' ? height + 'px' : height,
        width: typeof width === 'number' ? width + 'px' : width
    }"
></div>
</template>

<style scoped>
.base-chart {
    min-height: 200px;
}
</style>
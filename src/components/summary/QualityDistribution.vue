<script setup>

import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getChartTheme, isDarkMode } from '@/utils/chartTheme';
import { useSampleStore } from '@/store/sampleStore';

const store = useSampleStore();

const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

function initChart() {
    if (!chartRef.value) return;
    
    chartInstance = echarts.init(chartRef.value, null, {
        renderer: 'canvas'
    });
    
    updateChart();
}

function updateChart() {
    if (!chartInstance) return;
    
    const data = [
        { value: props.data.excellent || 0, name: '优秀' },
        { value: props.data.good || 0, name: '良好' },
        { value: props.data.warning || 0, name: '一般' },
        { value: props.data.poor || 0, name: '较差' },
        { value: props.data.fail || 0, name: '不合格' }
    ].filter(d => d.value > 0);
    
    const theme = getChartTheme(isDarkMode());
    
    chartInstance.setOption({
        backgroundColor: theme.backgroundColor,
        title: {
            text: 'RNA质量分布',
            left: 'center',
            textStyle: theme.textStyle
        },
        tooltip: {
            trigger: 'item',
            ...theme.tooltip
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            ...theme.legend
        },
        series: [
            {
                name: '质量分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: theme.backgroundColor,
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {c} ({d}%)',
                    color: theme.textStyle.color
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
                data: data,
                color: ['#67c23a', '#409eff', '#e6a23c', '#f56c6c', '#909399']
            }
        ]
    });
}

function handleResize() {
    chartInstance?.resize();
}

onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
});

watch(() => props.data, () => {
    updateChart();
}, { deep: true });

watch(() => store.dirty, () => {
    updateChart();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    chartInstance?.dispose();
});

defineExpose({
    getImage: () => chartInstance?.getDataURL()
});

</script>

<template>

<div class="quality-chart-wrapper">
    <div ref="chartRef" class="chart"></div>
</div>

</template>

<style scoped>

.quality-chart-wrapper{
    height: 100%;
    min-height: 280px;
}

.chart{
    width: 100%;
    height: 100%;
    min-height: 280px;
}

</style>
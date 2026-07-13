<script setup>
import { ref, computed, watch, defineExpose } from "vue";
import { useSampleStore } from "@/store/sampleStore";
import { useThemeStore } from "@/store/theme";
import { useEchart } from "@/charts/useEchart";
import { getChartTheme, getChartTextColor } from "@/charts/chartTheme";
import { getChartSamples } from "@/analysis/chart/chartDataAdapter";

const store = useSampleStore();
const theme = useThemeStore();
const chartRef = ref(null);

const qualityColors = {
    "合格": "#67c23a",
    "需关注": "#e6a23c",
    "不合格": "#f56c6c",
    "待检测": "#909399"
};

const option = computed(() => {
    const chartSamples = getChartSamples(store.samples);

    const count = {
        "合格": 0,
        "需关注": 0,
        "不合格": 0,
        "待检测": 0
    };

    chartSamples.forEach(s => {
        const level = s.analysis?.quality?.level;
        if (level && count.hasOwnProperty(level)) {
            count[level]++;
        }
    });

    const data = Object.entries(count).filter(([_, value]) => value > 0);
    const labels = data.map(([name]) => name);
    const values = data.map(([name, value]) => ({
        value,
        itemStyle: {
            color: qualityColors[name] || "#909399"
        }
    }));

    const textColor = getChartTextColor(theme.mode);

    return {
        ...getChartTheme(theme.mode),
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        xAxis: {
            type: "category",
            data: labels,
            axisLabel: {
                color: textColor
            },
            axisLine: {
                lineStyle: {
                    color: theme.mode === "dark" ? "#606266" : "#dcdfe6"
                }
            }
        },
        yAxis: {
            type: "value",
            axisLabel: {
                color: textColor
            },
            splitLine: {
                lineStyle: {
                    color: theme.mode === "dark" ? "#36383d" : "#ebeef5"
                }
            }
        },
        series: [{
            type: "bar",
            data: values,
            barWidth: "40%",
            label: {
                show: true,
                position: "top",
                color: textColor
            }
        }]
    };
});

const { refresh, dispose, getDataURL } = useEchart(chartRef, option);

watch(() => theme.mode, () => {
    dispose();
    setTimeout(() => refresh(), 50);
});

defineExpose({
    getDataURL
});
</script>

<template>
    <div ref="chartRef" class="chart" />
</template>

<style scoped>
.chart {
    height: 300px;
    width: 100%;
}
</style>
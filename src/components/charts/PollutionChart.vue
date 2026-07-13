<script setup>
import { ref, computed, watch, defineExpose } from "vue";
import { useSampleStore } from "@/store/sampleStore";
import { useThemeStore } from "@/store/theme";
import { useEchart } from "@/charts/useEchart";
import { getChartTheme, getChartTextColor } from "@/charts/chartTheme";
import { getPollutionColor } from "@/charts/pollutionChart";
import { pollutionSummary } from "@/utils/pollutionSummary";
import { getChartSamples } from "@/analysis/chart/chartDataAdapter";

const store = useSampleStore();
const theme = useThemeStore();
const chartRef = ref(null);

const option = computed(() => {
    const chartSamples = getChartSamples(store.samples);
    const data = pollutionSummary(chartSamples);
    const entries = Object.entries(data).filter(([_, value]) => value > 0);
    
    const labels = entries.map(([name]) => name);
    const values = entries.map(([name, value]) => ({
        value,
        itemStyle: {
            color: getPollutionColor(name)
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
                color: textColor,
                rotate: labels.length > 3 ? 30 : 0
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
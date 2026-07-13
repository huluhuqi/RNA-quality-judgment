import { onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import * as echarts from "echarts";

export function useEchart(el, option) {
    let chart = null;

    function init() {
        if (!el.value) return;

        chart = echarts.init(el.value);
        chart.setOption(option.value);
    }

    function resize() {
        chart?.resize();
    }

    function dispose() {
        chart?.dispose();
        chart = null;
    }

    function refresh() {
        if (!chart) {
            init();
        } else {
            chart.setOption(option.value, true);
        }
    }

    function getDataURL(options = {}) {
        return chart?.getDataURL({
            type: "png",
            pixelRatio: 2,
            backgroundColor: "transparent",
            ...options
        }) || "";
    }

    onMounted(() => {
        nextTick(() => {
            init();
            window.addEventListener("resize", resize);
        });
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", resize);
        dispose();
    });

    watch(option, (value) => {
        if (chart) {
            chart.setOption(value, true);
        }
    }, { deep: true });

    return {
        resize,
        refresh,
        dispose,
        getDataURL
    };
}
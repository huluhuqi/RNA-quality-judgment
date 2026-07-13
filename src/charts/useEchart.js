import { onMounted, onBeforeUnmount, watch, nextTick, getCurrentInstance } from "vue";
import * as echarts from "echarts";

export function useEchart(el, option) {
    let chart = null;
    let resizeTimer = null;

    function init() {
        if (!el.value) return;
        if (chart) return;

        chart = echarts.init(el.value);
        chart.setOption(option.value || {});
    }

    function resize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            chart?.resize();
        }, 100);
    }

    function dispose() {
        if (chart) {
            chart.dispose();
            chart = null;
        }
        if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
        }
    }

    function refresh() {
        if (!chart) {
            init();
        } else {
            chart.setOption(option.value || {}, true);
        }
    }

    function setOption(opt, notMerge = false) {
        if (chart) {
            chart.setOption(opt, notMerge);
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
        if (chart && value) {
            chart.setOption(value, true);
        }
    }, { deep: true });

    return {
        resize,
        refresh,
        dispose,
        setOption,
        getDataURL,
        getInstance: () => chart
    };
}

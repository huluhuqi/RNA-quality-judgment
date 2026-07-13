export function captureChart(chart) {
    return chart.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: "#fff"
    });
}
export function getChartTheme(theme) {
    const dark = theme === "dark";

    return {
        backgroundColor: dark ? "#1d1e20" : "#ffffff",
        textStyle: {
            color: dark ? "#e5eaf3" : "#303133"
        },
        axisLine: {
            lineStyle: {
                color: dark ? "#606266" : "#dcdfe6"
            }
        },
        splitLine: {
            lineStyle: {
                color: dark ? "#36383d" : "#ebeef5"
            }
        }
    };
}

export function getChartTextColor(theme) {
    return theme === "dark" ? "#e5eaf3" : "#303133";
}

export function getChartBgColor(theme) {
    return theme === "dark" ? "#1d1e20" : "#ffffff";
}
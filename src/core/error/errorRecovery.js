export function recoverFromError(type) {
    switch (type) {
        case "STORAGE":
            return "尝试重新读取缓存";
        case "CHART":
            return "重新初始化图表";
        case "FILE_IMPORT":
            return "重新选择文件";
        case "DATA_PARSE":
            return "检查数据格式";
        case "ANALYSIS":
            return "重新分析数据";
        case "EXPORT_EXCEL":
            return "重新导出Excel";
        case "EXPORT_PDF":
            return "重新生成PDF";
        case "WORKER":
            return "刷新页面后重试";
        default:
            return "请重新操作";
    }
}

export function getErrorMessage(type) {
    switch (type) {
        case "STORAGE":
            return "数据保存失败，请检查浏览器存储权限";
        case "CHART":
            return "图表加载失败，正在尝试恢复";
        case "FILE_IMPORT":
            return "文件导入失败，请检查文件格式";
        case "DATA_PARSE":
            return "数据解析失败，请检查数据格式";
        case "ANALYSIS":
            return "数据分析异常，请检查输入数据";
        case "EXPORT_EXCEL":
            return "Excel导出失败，请重试";
        case "EXPORT_PDF":
            return "PDF生成失败，请重试";
        case "WORKER":
            return "后台处理异常，请刷新页面";
        default:
            return "发生未知错误，请重试";
    }
}
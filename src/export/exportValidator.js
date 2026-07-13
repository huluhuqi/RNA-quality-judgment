export function validateExport(samples) {
    if (!samples.length) {
        throw new Error("没有可导出的RNA数据");
    }
    return true;
}
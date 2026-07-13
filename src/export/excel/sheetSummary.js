export function createSummarySheet(experiment, summary) {
    return [
        ["RNA质量分析报告"],
        [""],
        ["样本统计"],
        ["导入样本数", summary.total || 0],
        ["有效样本数", summary.active || 0],
        ["忽略样本数", summary.ignored || 0],
        [""],
        ["实验参数"],
        ["提取方法", experiment.extraction?.method || ""],
        ["样本来源", experiment.extraction?.source || ""],
        ["下游用途", experiment.application?.purpose || ""],
        [""],
        ["RNA质量统计"],
        ["合格", summary.quality?.good || 0],
        ["需关注", summary.quality?.warning || 0],
        ["不合格", summary.quality?.bad || 0],
        ["污染统计"],
        ...Object.entries(summary.pollution || {}).map(([key, value]) => [key, value])
    ];
}
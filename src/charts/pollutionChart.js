export const pollutionColors = {
    "蛋白质/酚类污染": "#f56c6c",
    "盐类/胍盐/试剂残留": "#409eff",
    "酚污染": "#e6a23c",
    "盐残留": "#909399",
    "胍盐残留": "#67c23a",
    "缺少A260/230数据": "#b37feb",
    "其它污染": "#909399"
};

export function getPollutionColor(type) {
    return pollutionColors[type] || "#909399";
}
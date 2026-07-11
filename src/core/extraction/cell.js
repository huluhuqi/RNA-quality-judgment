/**
 * 细胞RNA提取 - 污染诊断数据库
 */
export default {

    name: "细胞RNA提取",

    pollution: {

        protein: {
            title: "细胞蛋白污染风险",
            cause: [
                "细胞裂解不充分",
                "蛋白去除步骤不足",
                "细胞量过多导致裂解液不足"
            ],
            step: [
                "检查细胞裂解步骤",
                "检查蛋白去除流程"
            ],
            solution: [
                "优化细胞裂解条件",
                "减少细胞投入量",
                "增加去蛋白步骤"
            ]
        },

        guanidine: {
            title: "试剂或盐类残留风险",
            cause: [
                "洗涤不充分",
                "裂解液残留"
            ],
            step: [
                "检查洗涤步骤"
            ],
            solution: [
                "增加洗涤次数",
                "延长干燥时间"
            ]
        }

    }

}

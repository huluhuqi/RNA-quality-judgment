/**
 * 血液RNA提取 - 污染诊断数据库
 */
export default {

    name: "血液RNA提取法",

    pollution: {

        protein: {
            title: "血红蛋白或蛋白污染风险",
            cause: [
                "红细胞去除不足",
                "血液裂解不完全",
                "蛋白残留"
            ],
            step: [
                "检查红细胞裂解",
                "检查蛋白去除"
            ],
            solution: [
                "加强红细胞去除步骤",
                "优化裂解条件",
                "增加纯化"
            ]
        },

        guanidine: {
            title: "盐类或试剂残留风险",
            cause: [
                "洗涤不足",
                "裂解液残留"
            ],
            step: [
                "检查洗涤过程"
            ],
            solution: [
                "增加洗涤次数",
                "延长干燥时间"
            ]
        }

    }

}

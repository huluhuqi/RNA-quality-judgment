/**
 * 动物组织RNA提取 - 污染诊断数据库
 */
export default {

    name: "组织RNA提取法",

    pollution: {

        protein: {
            title: "组织蛋白污染风险",
            cause: [
                "组织裂解不足",
                "匀浆不充分",
                "蛋白释放较多"
            ],
            step: [
                "检查组织破碎",
                "检查裂解时间"
            ],
            solution: [
                "充分机械匀浆",
                "增加裂解时间",
                "减少单次样本量"
            ]
        },

        guanidine: {
            title: "脂质、盐类或裂解液残留风险",
            cause: [
                "组织脂质含量高",
                "洗涤不足"
            ],
            step: [
                "检查裂解纯化步骤"
            ],
            solution: [
                "增加纯化",
                "优化洗涤流程"
            ]
        }

    }

}

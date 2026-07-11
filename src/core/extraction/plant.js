/**
 * 植物RNA提取 - 污染诊断数据库
 */
export default {

    name: "植物RNA提取法",

    pollution: {

        protein: {
            title: "植物蛋白、多酚污染风险",
            cause: [
                "样品氧化",
                "多酚结合RNA",
                "蛋白去除不足"
            ],
            step: [
                "检查抗氧化体系",
                "检查裂解液组成"
            ],
            solution: [
                "增加PVP",
                "增加β-巯基乙醇",
                "快速低温处理样品"
            ]
        },

        guanidine: {
            title: "多糖、多酚或缓冲液残留风险",
            cause: [
                "植物次生代谢物较高",
                "洗涤不足"
            ],
            step: [
                "检查沉淀纯化",
                "检查洗涤步骤"
            ],
            solution: [
                "增加纯化步骤",
                "优化洗涤条件",
                "重新提取"
            ]
        }

    }

}

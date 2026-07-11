/**
 * CTAB法 - 污染诊断数据库
 */
export default {

    name: "CTAB法",

    pollution: {

        protein: {
            title: "蛋白、多酚污染风险",
            cause: [
                "蛋白去除不足",
                "植物次生代谢物残留",
                "有机抽提不足"
            ],
            step: [
                "检查CTAB裂解步骤",
                "检查氯仿抽提"
            ],
            solution: [
                "增加β-巯基乙醇",
                "增加PVP去除多酚",
                "优化有机抽提次数"
            ]
        },

        guanidine: {
            title: "多糖、多酚及CTAB残留风险",
            cause: [
                "植物多糖结合RNA",
                "CTAB去除不足",
                "盐离子残留"
            ],
            step: [
                "检查沉淀步骤",
                "检查洗涤步骤"
            ],
            solution: [
                "增加纯化步骤",
                "优化盐浓度",
                "进行RNA cleanup"
            ]
        }

    }

}

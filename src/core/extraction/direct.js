/**
 * 直接裂解法 - 污染诊断数据库
 */
export default {

    name: "直接裂解法",

    pollution: {

        protein: {
            title: "裂解液干扰风险",
            cause: [
                "未经过充分纯化",
                "细胞碎片残留"
            ],
            step: [
                "检查裂解时间",
                "检查样本量"
            ],
            solution: [
                "改用柱纯化",
                "改用磁珠纯化"
            ]
        },

        guanidine: {
            title: "裂解试剂残留风险",
            cause: [
                "缓冲液残留",
                "抑制物存在"
            ],
            step: [
                "检查裂解体系"
            ],
            solution: [
                "RNA cleanup",
                "重新提取高纯度RNA"
            ]
        }

    }

}

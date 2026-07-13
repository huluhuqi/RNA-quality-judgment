/**
 * RT状态枚举
 *
 * 统一所有RT相关模块的状态文本，
 * 禁止在组件中硬编码状态字符串。
 */

export const RT_STATUS = {
    OK: {
        code: "OK",
        text: "正常"
    },
    NO_CONCENTRATION: {
        code: "NO_CONCENTRATION",
        text: "缺少RNA浓度"
    },
    OVER_VOLUME: {
        code: "OVER_VOLUME",
        text: "超过最大模板体积"
    },
    LOW_INPUT: {
        code: "LOW_INPUT",
        text: "RNA投入量不足"
    }
};

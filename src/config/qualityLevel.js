/**
 * RNA质量等级统一定义
 *
 * value:
 * 程序内部判断使用
 *
 * label:
 * 页面显示
 */

export const QUALITY_LEVEL = {

    EXCELLENT: {
        value: "excellent",
        label: "优秀",
        score: 4
    },

    GOOD: {
        value: "good",
        label: "良好",
        score: 3
    },

    WARNING: {
        value: "warning",
        label: "一般",
        score: 2
    },

    POOR: {
        value: "poor",
        label: "较差",
        score: 1
    },

    FAIL: {
        value: "fail",
        label: "不合格",
        score: 0
    }

}

export const PENDING = {
    value: "pending",
    label: "待检测",
    score: -1
}

/**
 * 根据内部value或中文等级获取显示文字
 */
export function getQualityLabel(value) {
    if (!value) return "无法判断";

    const item = Object.values(QUALITY_LEVEL).find(item => item.value === value);

    if (value === PENDING.value) {
        return PENDING.label;
    }

    if (item) {
        return item.label;
    }

    const chineseMap = {
        "合格": "合格",
        "需关注": "需关注",
        "不合格": "不合格",
        "待检测": "待检测"
    };

    return chineseMap[value] || value;
}

/**
 * 判断是否异常RNA
 */
export function isPoorQuality(value) {

    return [
        QUALITY_LEVEL.POOR.value,
        QUALITY_LEVEL.FAIL.value
    ].includes(value);

}

/**
 * 兼容旧数据：中文质量等级 → 内部value
 */
export function normalizeQuality(value) {

    const map = {
        "优秀": QUALITY_LEVEL.EXCELLENT.value,
        "良好": QUALITY_LEVEL.GOOD.value,
        "一般": QUALITY_LEVEL.WARNING.value,
        "较差": QUALITY_LEVEL.POOR.value,
        "不合格": QUALITY_LEVEL.FAIL.value,
        "待检测": PENDING.value
    };

    return map[value] || value;

}

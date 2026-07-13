/**
 * RT状态标签样式配置
 *
 * 统一所有模块的RT状态显示：
 *   - OK:        绿色  ✓ 可直接RT
 *   - OVER_VOLUME: 黄色  ⚠ 模板体积超限
 *   - NO_CONCENTRATION: 灰色  ○ 缺少浓度
 */

export const RT_STATUS_STYLE = {
    OK: {
        type: "success",
        label: "可直接RT",
        icon: "✓"
    },
    OVER_VOLUME: {
        type: "warning",
        label: "模板体积超限",
        icon: "⚠"
    },
    NO_CONCENTRATION: {
        type: "info",
        label: "缺少浓度",
        icon: "○"
    },
    LOW_INPUT: {
        type: "warning",
        label: "投入量不足",
        icon: "⚠"
    }
};

/**
 * 根据statusCode获取RT状态样式
 * @param {string} statusCode
 * @returns {Object} { type, label, icon }
 */
export function getRtStatusStyle(statusCode) {
    return RT_STATUS_STYLE[statusCode] || RT_STATUS_STYLE.NO_CONCENTRATION;
}

/**
 * 获取RT状态完整显示文本（图标+标签）
 * @param {string} statusCode
 * @returns {string}
 */
export function getRtStatusDisplay(statusCode) {
    const style = getRtStatusStyle(statusCode);
    return `${style.icon} ${style.label}`;
}

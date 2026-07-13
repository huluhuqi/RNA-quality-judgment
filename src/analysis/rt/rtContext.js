/**
 * RT计算上下文
 *
 * 统一获取RT推荐RNA投入量，
 * 所有RT相关计算统一从此模块获取 targetRNA。
 */

/**
 * 创建RT上下文
 * @param {Object} summary 实验总分析结果
 * @returns {{ targetRNA:number }}
 */
export function createRTContext(summary = {}) {
    return {
        targetRNA: summary.recommendedRNA || summary.rt?.recommendedRNA || 100
    };
}

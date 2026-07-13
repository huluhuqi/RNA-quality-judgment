/**
 * RT模板体积范围汇总
 *
 * 从有效样本中提取所有可计算的模板体积，
 * 返回最小值和最大值。
 */

/**
 * 汇总有效样本的模板体积范围
 * @param {Array} samples 有效样本数组
 * @returns {{ min:number, max:number }|null}
 */
export function summarizeVolume(samples = []) {
    const volumes = samples
        .filter(s => s.rt?.templateVolume !== null && s.rt?.templateVolume !== undefined)
        .map(s => s.rt.templateVolume);

    if (volumes.length === 0) {
        return null;
    }

    return {
        min: Math.min(...volumes),
        max: Math.max(...volumes)
    };
}

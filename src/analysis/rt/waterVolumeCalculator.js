/**
 * RT补水体积计算
 *
 * 公式：补水体积(μL) = 最大模板体积(μL) - RNA模板体积(μL)
 *
 * 处理逻辑：
 *   - 模板体积为空 → 无法计算
 *   - 补水体积 ≥ 0 → 正常
 *   - 补水体积 < 0 → 超过模板限制
 */

/**
 * 计算RT补水体积
 *
 * @param {number|null} templateVolume RNA模板体积 (μL)
 * @param {number} maxTemplateVolume 最大模板体积 (μL)，默认12
 * @returns {{ waterVolume:number|null, status:string }}
 */
export function calculateWaterVolume(templateVolume, maxTemplateVolume = 12) {
    if (templateVolume === null || templateVolume === undefined) {
        return {
            waterVolume: null,
            status: "无法计算"
        };
    }

    const waterVolume = maxTemplateVolume - templateVolume;

    return {
        waterVolume: Number(waterVolume.toFixed(2)),
        status: waterVolume >= 0 ? "正常" : "超过模板限制"
    };
}

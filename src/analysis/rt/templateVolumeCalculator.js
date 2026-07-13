/**
 * RT模板体积计算
 *
 * 公式：体积(μL) = 推荐RNA量(ng) ÷ RNA浓度(ng/μL)
 *
 * 处理逻辑：
 *   - 缺少浓度 → 无法计算
 *   - 浓度 ≤ 0 → 无法计算
 *   - 体积 > 20μL → 浓度不足
 *   - 正常 → 返回体积值
 */

/**
 * 计算单个样本的模板建议体积
 *
 * @param {number|null} concentration RNA浓度 (ng/μL)
 * @param {number} targetRNA 推荐RNA投入量 (ng)
 * @returns {{ value:number|null, status:string, reason:string|null }}
 */
export function calculateTemplateVolume(concentration, targetRNA) {
    if (
        concentration === null ||
        concentration === undefined ||
        concentration === "" ||
        isNaN(Number(concentration)) ||
        Number(concentration) <= 0
    ) {
        return {
            value: null,
            status: "无法计算",
            reason: "缺少RNA浓度"
        };
    }

    const conc = Number(concentration);
    const volume = targetRNA / conc;

    if (volume > 20) {
        return {
            value: Number(volume.toFixed(2)),
            status: "浓度不足",
            reason: "需要较大模板体积，建议浓缩RNA"
        };
    }

    return {
        value: Number(volume.toFixed(2)),
        status: "可计算",
        reason: null
    };
}

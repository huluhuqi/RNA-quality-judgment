/**
 * RT模板体积计算（唯一计算入口）
 *
 * 公式：体积(μL) = 推荐RNA量(ng) ÷ RNA浓度(ng/μL)
 *
 * 处理逻辑：
 *   - 缺少浓度 → 无法计算
 *   - 浓度 ≤ 0 → 无法计算
 *   - 体积 > 12μL → 超过最大模板体积
 *   - 正常 → 返回体积值
 *
 * ⚠ 本模块是唯一允许计算模板体积的地方。
 *   所有组件、导出、详情页禁止自行计算，必须读取 sample.rt.templateVolume。
 */

/**
 * 计算单个样本的模板建议体积
 *
 * @param {number|null} concentration RNA浓度 (ng/μL)
 * @param {number} targetRNA 推荐RNA投入量 (ng)
 * @returns {{ templateVolume:number|null, status:string }}
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
            templateVolume: null,
            status: "无法计算"
        };
    }

    const conc = Number(concentration);
    const volume = targetRNA / conc;

    return {
        templateVolume: Number(volume.toFixed(2)),
        status: volume <= 12 ? "正常" : "超过最大模板体积"
    };
}

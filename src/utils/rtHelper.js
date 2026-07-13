/**
 * RT数据只读帮助函数
 *
 * 所有组件必须通过此模块读取 sample.rtConfig 数据，
 * 禁止自行计算模板体积或补水体积。
 *
 * 唯一计算入口：src/analysis/rt/templateVolumeCalculator.js
 * 唯一写入入口：src/App.vue → refreshAnalysis()
 *
 * 字段名：sample.rtConfig（2026-07 统一冻结）
 * 兼容旧字段：sample.rt（自动降级读取）
 */

function getRT(sample) {
    return sample?.rtConfig || sample?.rt || {};
}

export function getTemplateVolumeDisplay(sample) {
    const volume = getRT(sample).templateVolume;
    if (volume !== null && volume !== undefined) {
        return volume + " μL";
    }
    return "无法计算";
}

export function getTemplateVolumeValue(sample) {
    return getRT(sample).templateVolume ?? null;
}

export function getRTStatusCode(sample) {
    return getRT(sample).statusCode || "";
}

export function getRTStatusText(sample) {
    return getRT(sample).statusText || "无法计算";
}

export function getRTSuggestion(sample) {
    return getRT(sample).suggestion || "";
}

export function getRequiredConcentration(sample) {
    return getRT(sample).requiredConcentration ?? null;
}

export function getTargetRNA(sample) {
    return getRT(sample).targetRNA || 0;
}

export function getMaxTemplateVolume(sample) {
    return getRT(sample).maxTemplateVolume ?? 12;
}

export function getWaterVolumeDisplay(sample) {
    const wv = getRT(sample).waterVolume;
    if (wv !== null && wv !== undefined) {
        return wv + " μL";
    }
    return "无法配置";
}

export function getWaterVolumeValue(sample) {
    return getRT(sample).waterVolume ?? null;
}

/**
 * 污染类型统一映射
 *
 * 分析模块输出英文 type（protein / guanidine / ethanol）
 * 提取建议库统一使用英文 key
 * UI 显示使用中文标签
 *
 * 此文件负责三者之间的映射转换。
 */

/**
 * 污染类型别名表
 *
 * key   = 标准英文 type（数据库 key）
 * value = 所有可能出现的别名列表（含中文、英文、混合）
 */
export const contaminationAlias = {
    protein: [
        "protein",
        "蛋白",
        "蛋白质",
        "蛋白质/酚类污染",
        "蛋白质/酚类残留",
        "酚类",
        "酚类污染"
    ],
    guanidine: [
        "guanidine",
        "guanidinium",
        "胍盐",
        "胍盐残留",
        "盐类/胍盐/试剂残留",
        "盐类/胍盐/试剂残留风险",
        "盐类/试剂残留",
        "盐类或提取试剂残留风险",
        "盐类或试剂残留"
    ],
    ethanol: [
        "ethanol",
        "乙醇",
        "乙醇残留"
    ]
}

/**
 * 英文 type → 中文显示名
 */
export const contaminationDisplay = {
    protein: "蛋白质/酚类污染",
    guanidine: "盐类/胍盐/试剂残留",
    ethanol: "乙醇残留",
    general: "其他污染风险"
}

/**
 * 标准化污染类型
 *
 * 将任意输入（中文/英文/混合）统一映射到标准英文 key。
 * 匹配不到时返回原始小写值。
 *
 * @param {string} type  污染类型（任意格式）
 * @returns {string|null}  标准英文 key（protein / guanidine / ethanol）
 */
export function normalizeContaminationType(type) {
    if (!type) return null

    const value = String(type).trim().toLowerCase()

    for (const key in contaminationAlias) {
        const list = contaminationAlias[key].map(item => String(item).toLowerCase())
        if (list.includes(value)) {
            return key
        }
    }

    return value
}

/**
 * 获取污染类型的中文显示名
 *
 * @param {string} type  英文 type 或中文别名
 * @returns {string}  中文显示名
 */
export function getContaminationDisplay(type) {
    const normalized = normalizeContaminationType(type)
    return contaminationDisplay[normalized] || type || ""
}

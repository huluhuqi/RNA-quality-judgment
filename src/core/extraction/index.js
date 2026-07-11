/**
 * 提取方法数据库统一入口
 *
 * extractionDatabase[key] 返回该方法的污染诊断数据，
 * 结构：{ name, pollution: { protein: {title,cause,step,solution}, guanidine: {...} } }
 */

import column from "./column"
import trizol from "./trizol"
import magnetic from "./magneticBeads"
import ctab from "./ctab"
import plant from "./plant"
import blood from "./blood"
import tissue from "./tissue"
import direct from "./direct"


/**
 * 提取方法枚举（供 UI 下拉选择使用）
 */
export const extractionMethods = [
    { value: "硅胶膜柱提法", label: "硅胶膜柱提法" },
    { value: "TRIzol/酚氯仿法", label: "TRIzol/酚氯仿法" },
    { value: "磁珠法", label: "磁珠法" },
    { value: "CTAB法", label: "CTAB法" },
    { value: "植物RNA提取法", label: "植物RNA提取法" },
    { value: "血液RNA提取法", label: "血液RNA提取法" },
    { value: "组织RNA提取法", label: "组织RNA提取法" },
    { value: "直接裂解法", label: "直接裂解法" }
]


/**
 * 污染诊断数据库
 *
 * 以方法名（中文）为 key，与 RTParameter config.method 保持一致。
 */
export const extractionDatabase = {
    "硅胶膜柱提法": column,
    "TRIzol/酚氯仿法": trizol,
    "磁珠法": magnetic,
    "CTAB法": ctab,
    "植物RNA提取法": plant,
    "血液RNA提取法": blood,
    "组织RNA提取法": tissue,
    "直接裂解法": direct
}

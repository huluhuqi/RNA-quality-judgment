/**
 * 提取方法数据库统一入口
 *
 * 数据库使用内部 ID（column/trizol/magnetic/...）作为 key，
 * 前端中文名通过 extractionMethodMap 映射到 ID。
 *
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
import cellData from "./cell"

import {
    getExtractionMethodId,
    getExtractionMethodName,
    extractionMethodMap
} from "../../config/extractionMethodMap"


/**
 * 提取方法枚举（供 UI 下拉选择使用）
 *
 * value: 内部 ID
 * label: 前端显示中文名
 */
export const extractionMethods = [
    { value: "column",   label: "硅胶膜柱提法" },
    { value: "trizol",   label: "TRIzol/酚氯仿法" },
    { value: "magnetic", label: "磁珠法" },
    { value: "ctab",     label: "CTAB法" },
    { value: "plant",    label: "植物RNA提取法" },
    { value: "blood",    label: "血液RNA提取法" },
    { value: "tissue",   label: "组织RNA提取法" },
    { value: "cell",     label: "细胞RNA提取" },
    { value: "direct",   label: "直接裂解法" }
]


/**
 * 污染诊断数据库（内部 ID 为 key）
 */
export const extractionDatabase = {
    column,
    trizol,
    magnetic,
    ctab,
    plant,
    blood,
    tissue,
    cell: cellData,
    direct
}


/**
 * 根据方法名（中文名或ID）获取数据库数据
 *
 * @param {string} method  方法名（中文名或内部ID）
 * @returns {Object|null}  数据库对象，找不到返回 null
 */
export function getExtractionDatabase(method){

    if(!method) return null;

    const id = getExtractionMethodId(method);
    if(!id) return null;

    return extractionDatabase[id] || null;

}


/**
 * 根据方法名（中文名或ID）获取显示用中文名
 *
 * @param {string} method  方法名（中文名或内部ID）
 * @returns {string}  显示用中文名
 */
export function getExtractionDisplayName(method){

    return getExtractionMethodName(method) || method || "";

}


// 导出映射工具，方便外部使用
export {
    getExtractionMethodId,
    getExtractionMethodName,
    extractionMethodMap
}

/**
 * RNA 提取方法名称映射
 *
 * 作用：前端显示名称 → 内部数据库 ID
 *
 * 页面显示：柱式离心吸附法 / 硅胶膜柱提法
 * 程序内部：column
 *
 * 新增提取方法时，只需在这里补充别名即可，无需修改数据库。
 */


/**
 * 显示名 → 内部 ID 映射
 *
 * key: 前端显示名称（用户可能选择的名称）
 * value: 内部数据库 ID
 */
export const extractionMethodMap = {

    // 柱式RNA提取
    "硅胶膜柱提法": "column",
    "柱式离心吸附法": "column",
    "柱式提取": "column",
    "RNA提取柱": "column",
    "柱提法": "column",

    // TRIzol / 酚氯仿
    "TRIzol/酚氯仿法": "trizol",
    "TRIzol法": "trizol",
    "酚氯仿提取": "trizol",
    "Trizol法": "trizol",

    // 磁珠法
    "磁珠法": "magnetic",
    "磁珠纯化法": "magnetic",
    "磁珠提取": "magnetic",

    // CTAB法
    "CTAB法": "ctab",
    "CTAB提取": "ctab",

    // 植物RNA提取
    "植物RNA提取法": "plant",
    "植物RNA提取": "plant",

    // 血液RNA提取
    "血液RNA提取法": "blood",
    "血液RNA提取": "blood",

    // 组织RNA提取
    "组织RNA提取法": "tissue",
    "动物组织RNA提取": "tissue",
    "组织提取": "tissue",

    // 细胞RNA提取
    "细胞RNA提取": "cell",
    "细胞提取": "cell",

    // 直接裂解
    "直接裂解法": "direct",
    "直接提取": "direct"
}


/**
 * 内部 ID → 默认显示名
 *
 * 用于需要反向显示方法名的场景。
 */
export const extractionMethodIdToName = {
    column: "硅胶膜柱提法",
    trizol: "TRIzol/酚氯仿法",
    magnetic: "磁珠法",
    ctab: "CTAB法",
    plant: "植物RNA提取法",
    blood: "血液RNA提取法",
    tissue: "组织RNA提取法",
    cell: "细胞RNA提取",
    direct: "直接裂解法"
}


/**
 * 获取标准提取方法 ID
 *
 * @param {string} method  用户选择的方法（中文名或已为 ID）
 * @returns {string|null}  内部数据库 ID，找不到返回 null
 */
export function getExtractionMethodId(method){

    if(!method) return null;

    // 已经是内部 ID
    if([
        "column", "trizol", "magnetic", "ctab",
        "plant", "blood", "tissue", "cell", "direct"
    ].includes(method)){
        return method;
    }

    // 从映射表查找
    return extractionMethodMap[method] || null;

}


/**
 * 获取提取方法显示名
 *
 * @param {string} method  方法 ID 或中文名
 * @returns {string}  显示用中文名
 */
export function getExtractionMethodName(method){

    if(!method) return "";

    // 如果是 ID，转中文名
    if(extractionMethodIdToName[method]){
        return extractionMethodIdToName[method];
    }

    // 已经是中文名，直接返回
    return method;

}

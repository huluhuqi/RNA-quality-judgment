const KEY = "RNA_QC_EXPERIMENT"

import { normalizeSamples } from '../core/sampleModel'



/**
 * 保存实验数据
 *
 * 优化：不保存 sample.result（分析结果），
 * 重新加载时由 refreshAnalysis 自动重新生成，
 * 显著减少 localStorage 占用。
 */

export function saveExperiment(data){
    try {
        const toSave = {
            ...data,
            samples: (data.samples || []).map(item => {
                const { result, ...rest } = item
                return rest
            })
        }

        localStorage.setItem(
            KEY,
            JSON.stringify(toSave)
        )
    } catch (e) {
        console.error("实验数据保存失败", e)
    }
}




/**
 * 读取实验数据
 */

export function loadExperiment(){
    try {
        const data = localStorage.getItem(KEY)

        if(!data){
            return null
        }

        const parsed = JSON.parse(data)

        // 兼容旧数据：统一 sample 字段结构
        if(parsed && Array.isArray(parsed.samples)){
            parsed.samples = normalizeSamples(parsed.samples)
        }

        return parsed
    } catch (e) {
        console.error("实验数据读取失败", e)
        return null
    }
}




/**
 * 删除实验数据
 */

export function clearExperiment(){


    localStorage.removeItem(KEY)


}

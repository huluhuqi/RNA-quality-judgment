const KEY = "RNA_QC_EXPERIMENT"

import { normalizeSamples } from '../core/sampleModel'



/**
 * 保存实验数据
 */

export function saveExperiment(data){


    localStorage.setItem(

        KEY,

        JSON.stringify(data)

    )


}




/**
 * 读取实验数据
 */

export function loadExperiment(){


    const data =
    localStorage.getItem(KEY)



    if(!data){

        return null

    }


    const parsed = JSON.parse(data)


    // 兼容旧数据：统一 sample 字段结构
    if(parsed && Array.isArray(parsed.samples)){
        parsed.samples = normalizeSamples(parsed.samples)
    }


    return parsed


}




/**
 * 删除实验数据
 */

export function clearExperiment(){


    localStorage.removeItem(KEY)


}

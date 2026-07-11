const KEY = "RNA_QC_EXPERIMENT"



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


    return JSON.parse(data)


}




/**
 * 删除实验数据
 */

export function clearExperiment(){


    localStorage.removeItem(KEY)


}

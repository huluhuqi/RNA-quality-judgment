// 数据质量检查
// 检测样本ID缺失、数值范围异常、非数字输入

export function validateSample(item){

    const errors = []

    if(!item.id){
        errors.push("缺少模板ID")
    }

    if(
        item.a260280 !== null &&
        item.a260280 !== undefined &&
        (item.a260280 < 0 || item.a260280 > 5)
    ){
        errors.push("A260/280范围异常")
    }

    if(
        item.a260230 !== null &&
        item.a260230 !== undefined &&
        (item.a260230 < 0 || item.a260230 > 5)
    ){
        errors.push("A260/230范围异常")
    }

    if(
        item.concentration !== null &&
        item.concentration !== undefined &&
        item.concentration < 0
    ){
        errors.push("RNA浓度异常")
    }

    return errors

}


// 批量校验，返回 { valid, invalid }
export function validateBatch(list){

    const valid = []
    const invalid = []

    list.forEach(item=>{

        const errors = validateSample(item)

        if(errors.length){
            invalid.push({
                item,
                errors
            })
        } else {
            valid.push(item)
        }

    })

    return { valid, invalid }

}

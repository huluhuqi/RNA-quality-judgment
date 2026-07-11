// Excel粘贴数据增强解析器
// 自动识别3列（ID/A260-280/A260-230）或4列（ID/浓度/A260-280/A260-230）格式
// 支持：跳过空行、去除前后空格、自动转换数字、识别异常

export function parsePasteData(text){

    const rows = text
        .trim()
        .split(/\r?\n/)

    const result = []

    rows.forEach(row=>{

        if(!row.trim()) return

        const cols = row.split(/\t/)

        if(cols.length < 3) return

        const id = cols[0]?.trim()

        if(!id) return

        let concentration = null
        let a280 = null
        let a230 = null

        if(cols.length >= 4){
            // 4列：ID 浓度 A260/280 A260/230
            concentration = toNumber(cols[1])
            a280 = toNumber(cols[2])
            a230 = toNumber(cols[3])
        } else {
            // 3列：ID A260/280 A260/230
            a280 = toNumber(cols[1])
            a230 = cols[2] ? toNumber(cols[2]) : null
        }

        result.push({
            id: id,
            concentration: concentration,
            a260280: a280,
            a260230: a230,
            ignored: false
        })

    })

    return result

}


function toNumber(value){

    if(value === null || value === undefined) return null

    const trimmed = String(value).trim()

    if(!trimmed) return null

    const num = Number(trimmed)

    return isNaN(num) ? null : num

}

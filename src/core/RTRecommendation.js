/**
 * 反转录RNA投入量推荐
 *
 * 输入：
 *
 * samples:
 * [
 *  {
 *   concentration: ng/uL
 *  }
 * ]
 *
 * config:
 * {
 *  maxRNA:1000,
 *  minRNA:10,
 *  maxVolume:12
 * }
 *
 */


export function calculateRT(samples, config){


    if(
        !samples ||
        samples.length===0
    ){

        return {

            recommendedRNA:0,

            minVolume:0,

            maxVolume:0,

            level:"无法判断",

            message:"未检测到RNA浓度数据",

            warning:'暂无数据',

            suggestion:'请输入RNA样本数据'

        }

    }



    // 获取有效浓度

    const concentrations = samples

        .map(
            s=>Number(s.concentration)
        )

        .filter(
            v=>!isNaN(v)&&v>0
        )



    if(concentrations.length===0){

        return {

            recommendedRNA:0,

            minVolume:0,

            maxVolume:0,

            level:"无法判断",

            message:"暂无有效RNA浓度数据",

            warning:'无有效RNA浓度',

            suggestion:'请输入RNA浓度'

        }

    }



    // 排序

    const sorted = [...concentrations].sort((a,b)=>a-b)

    const minConc = sorted[0]

    const maxConc = sorted[sorted.length - 1]

    const avgConc = concentrations.reduce((a,b)=>a+b, 0) / concentrations.length



    /*

    最低样本最大可投入量

    = 最低浓度 × 最大模板体积

    */

    const maxInputByLowest = minConc * config.maxVolume



    /*
    ====================
    情况1：RNA整体充足
    ====================
    */

    if(maxInputByLowest >= 500){

        const amount = 500

        const minVolume = Number((amount / maxConc).toFixed(2))

        const maxVolume = Number((amount / minConc).toFixed(2))

        let message =
            `本批次RNA浓度整体充足，建议统一反转录投入 ${amount}ng RNA。\n\n` +
            `最低浓度样本理论加入体积：${maxVolume} μL。\n` +
            `最高浓度样本理论加入体积：${minVolume} μL。\n\n` +
            `建议控制模板加入体积在 2-10μL 范围内，提高实验一致性。`

        let level = "浓度充足"
        let warning = "模板量充足"
        let suggestion = `建议本批次所有样本统一投入${amount}ng RNA进行反转录`

        // 浓度过高提示
        if(minVolume < 2){
            message += `\n\n⚠ 注意：高浓度样本加入体积不足 2μL，移液误差较大。建议适当稀释RNA模板。`
            warning = "部分样本浓度过高，建议稀释"
        }

        return {
            recommendedRNA: amount,
            minVolume,
            maxVolume,
            level,
            message,
            warning,
            suggestion,
            minConcentration: minConc,
            maxConcentration: maxConc,
            avgConcentration: Number(avgConc.toFixed(2))
        }

    }



    /*
    ====================
    情况2：可以满足300ng
    ====================
    */

    if(maxInputByLowest >= 300){

        const amount = 300

        const minVolume = Number((amount / maxConc).toFixed(2))

        const maxVolume = Number((amount / minConc).toFixed(2))

        return {
            recommendedRNA: amount,
            minVolume,
            maxVolume,
            level: "浓度一般",
            message:
                `本批次RNA浓度可以满足常规反转录需求。\n\n` +
                `建议统一投入 ${amount}ng RNA。\n\n` +
                `最低浓度样本加入体积：${maxVolume} μL。\n` +
                `部分低浓度样本接近限制，建议避免进一步稀释。`,
            warning: "浓度基本满足",
            suggestion: `建议统一投入${amount}ng RNA，注意低浓度样本`,
            minConcentration: minConc,
            maxConcentration: maxConc,
            avgConcentration: Number(avgConc.toFixed(2))
        }

    }



    /*
    ====================
    情况3：只能满足100ng
    ====================
    */

    if(maxInputByLowest >= 100){

        const amount = 100

        const minVolume = Number((amount / maxConc).toFixed(2))

        const maxVolume = Number((amount / minConc).toFixed(2))

        return {
            recommendedRNA: amount,
            minVolume,
            maxVolume,
            level: "浓度偏低",
            message:
                `本批次RNA浓度偏低。\n\n` +
                `建议降低反转录模板投入：${amount}ng RNA。\n\n` +
                `建议：\n` +
                `1. 保持所有样本投入量一致；\n` +
                `2. 优先保证低浓度样本；\n` +
                `3. 如需提高灵敏度，可考虑RNA浓缩。`,
            warning: "浓度偏低，建议降低投入量",
            suggestion: `建议降低投入量至${amount}ng，必要时浓缩RNA`,
            minConcentration: minConc,
            maxConcentration: maxConc,
            avgConcentration: Number(avgConc.toFixed(2))
        }

    }



    /*
    ====================
    情况4：浓度不足
    ====================
    */

    const amount = Math.floor(maxInputByLowest)

    return {
        recommendedRNA: amount,
        minVolume: config.maxVolume,
        maxVolume: config.maxVolume,
        level: "浓度不足",
        message:
            `本批次存在RNA浓度不足情况。\n\n` +
            `当前最大模板体积：${config.maxVolume} μL。\n` +
            `最低浓度样本最多只能提供：${maxInputByLowest.toFixed(1)}ng RNA。\n\n` +
            `建议：\n` +
            `1. 浓缩RNA；\n` +
            `2. 增加RNA提取量；\n` +
            `3. 检查RNA降解情况；\n` +
            `4. 低浓度样本单独优化。`,
        warning: "浓度严重不足，无法满足推荐投入量",
        suggestion: "建议浓缩RNA或重新提取",
        minConcentration: minConc,
        maxConcentration: maxConc,
        avgConcentration: Number(avgConc.toFixed(2))
    }


}


/**
 * 浓度分布异常检查
 */
export function checkConcentrationDistribution(samples){

    const values = samples
        .map(i => Number(i.concentration))
        .filter(v => !isNaN(v) && v > 0)

    if(values.length < 2){
        return ""
    }

    const max = Math.max(...values)
    const min = Math.min(...values)

    if(max / min > 20){
        return (
            `本批次RNA浓度差异较大。\n` +
            `最高浓度：${max} ng/μL\n` +
            `最低浓度：${min} ng/μL\n\n` +
            `建议：RT前统一稀释RNA模板，减少样本间输入偏差。`
        )
    }

    return ""
}

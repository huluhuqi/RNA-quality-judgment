import { analyzeRNA } from './RNAQuality'


export function calculateBatch(samples){


    if(!samples || samples.length===0){

        return {

            totalCount:0,

            validCount:0,

            ignoredCount:0,

            avgConcentration:0,

            minConcentration:0,

            maxConcentration:0,

            avgA260280:0,

            avgA260230:0,

            quality:'暂无数据',

            qualityDetail:{

                '优秀':0,

                '良好':0,

                '一般':0,

                '较差':0

            },

            pollution:'暂无数据',

            pollutionSummary:'暂无数据',

            pollutionSamples:[],

            abnormal:0

        }

    }


    const totalCount = samples.length

    const validSamples =
        samples.filter(
            item=>!item.ignored
        )

    const ignoredCount = totalCount - validSamples.length


    if(validSamples.length===0){

        return {

            totalCount,

            validCount:0,

            ignoredCount,

            avgConcentration:0,

            minConcentration:0,

            maxConcentration:0,

            avgA260280:0,

            avgA260230:0,

            quality:'暂无数据',

            qualityDetail:{

                '优秀':0,

                '良好':0,

                '一般':0,

                '较差':0

            },

            pollution:'暂无数据',

            pollutionSummary:'暂无数据',

            pollutionSamples:[],

            abnormal:0

        }

    }


    // 浓度

    const concentrations =
        validSamples
        .map(i=>Number(i.concentration))
        .filter(i=>!isNaN(i))


    // A260/A280

    const a280 =
        validSamples
        .map(i=>Number(i.a260280))
        .filter(i=>!isNaN(i))


    // A260/A230

    const a230 =
        validSamples
        .map(i=>Number(i.a260230))
        .filter(i=>!isNaN(i))


    function average(arr){

        if(arr.length===0){

            return 0

        }

        return (
            arr.reduce(
                (a,b)=>a+b,
                0
            )
            /
            arr.length
        )

    }


    const results =
        validSamples.map((s,i)=>{

            return {

                sample:s,

                analysis:analyzeRNA(s)

            }

        })


    // 质量统计

    let qualityCount={

        '优秀':0,

        '良好':0,

        '一般':0,

        '较差':0

    }


    results.forEach(r=>{

        const q = r.analysis.quality

        if(qualityCount[q] !== undefined){

            qualityCount[q]++

        }

    })


    // 总体质量评级

    const hasQuality =
        qualityCount['优秀']+
        qualityCount['良好']+
        qualityCount['一般']+
        qualityCount['较差']

    if(hasQuality===0){

        overall="暂无数据"

    }
    else{

        const badRate=
            qualityCount['较差'] /
            hasQuality

        const goodRate=
            (
                qualityCount['优秀']+
                qualityCount['良好']
            )
            /
            hasQuality

        if(
            qualityCount['优秀']/hasQuality>=0.8
            &&
            badRate<0.05
        ){

            overall="优秀"

        }

        else if(
            goodRate>=0.8
        ){

            overall="良好"

        }

        else if(
            badRate>0.3
        ){

            overall="较差"

        }

        else{

            overall="一般"

        }

    }


    // 污染统计

    let pollutionCount=0

    let proteinCount=0

    let saltCount=0

    let pollutionSamples=[]


    results.forEach(r=>{

        const p = r.analysis.pollution

        if(
            p!=='未发现明显污染'
            &&
            p!=='暂无纯度数据'
        ){

            pollutionCount++

            const reasons=[]


            if(p.includes('蛋白质')||p.includes('酚类')){

                proteinCount++

                reasons.push('蛋白/酚类污染风险')

            }

            if(p.includes('严重盐类')||p.includes('胍盐')){

                saltCount++

                reasons.push('严重盐类/胍盐残留')

            }
            else if(p.includes('盐离子')||p.includes('乙醇')||p.includes('提取试剂')){

                saltCount++

                reasons.push('盐离子/试剂残留')

            }
            else if(p.includes('轻微有机物')||p.includes('盐类')){

                reasons.push('轻微有机物/盐类残留')

            }


            pollutionSamples.push({

                id:r.sample.id,

                a260280:r.sample.a260280,

                a260230:r.sample.a260230,

                reason:reasons.join('；')

            })

        }

    })


    // 污染总结

    let pollutionSummary=''

    const summaryParts=[]


    if(saltCount>0){

        summaryParts.push(
            `A260/A230偏低样本${saltCount}个，提示盐类、胍盐或有机试剂残留风险`
        )

    }

    if(proteinCount>0){

        summaryParts.push(
            `A260/A280异常样本${proteinCount}个，提示蛋白或酚类污染可能`
        )

    }


    if(summaryParts.length===0){

        pollutionSummary='多数样本纯度良好，未发现明显污染'

    }
    else{

        pollutionSummary =
            '本批次主要存在' +
            summaryParts.join('；') +
            '。'

    }


    return {

        totalCount,

        validCount:validSamples.length,

        ignoredCount,

        avgConcentration:
            average(concentrations),

        minConcentration:
            Math.min(...concentrations),

        maxConcentration:
            Math.max(...concentrations),

        avgA260280:
            average(a280),

        avgA260230:
            average(a230),

        quality:overall,

        qualityDetail:qualityCount,

        pollution:

        pollutionCount===0

        ?

        '未发现明显污染'

        :

        `发现${pollutionCount}个样本存在污染风险`,

        pollutionSummary,

        pollutionSamples,

        abnormal:

            qualityCount['较差']

    }

}

/**
 * RNA质量分析
 */

import { extractionAdvice } from '../config/extractionAdvice'

import { downstreamApplications } from '../config/downstreamApplication'

import { getExtractionAdvice } from '../config/getExtractionDiagnosis'


export function analyzeRNA(sample, extractionMethod, application){


    const a280 =
        parseFloat(sample.a260280)


    const a230 =
        parseFloat(sample.a260230)


    const hasA280 =
        !isNaN(a280)


    const hasA230 =
        !isNaN(a230)


    let quality = ''

    let pollution = ''

    let suggestion = ''

    let pollutionType = null

    const appConfig = downstreamApplications[application] || downstreamApplications.qPCR

    let diagnosis = {
        protein: null,
        salt: null
    }


    if(!hasA280){


        quality = '待检测'


    }

    else{

        const req = appConfig.requirements

        const [min280, max280] = req.a280

        const req230 = req.a230

        let score = 0
        let total = 0

        if(hasA280){
            total++
            if(a280 >= min280 && a280 <= max280){
                score++
            } else if(a280 >= min280 - 0.1 && a280 <= max280 + 0.1){
                score += 0.5
            }
        }

        if(hasA230){
            total++
            if(a230 >= req230){
                score++
            } else if(a230 >= req230 - 0.3){
                score += 0.5
            }
        }

        const ratio = score / total

        if(ratio >= 1){
            quality = '优秀'
        } else if(ratio >= 0.75){
            quality = '良好'
        } else if(ratio >= 0.5){
            quality = '一般'
        } else {
            quality = '较差'
        }
    }



    let pollutionList=[]



    if(hasA280){


        if(a280<1.8){


            pollutionList.push(
                'A260/A280偏低，提示蛋白质或酚类污染风险'
            )

            pollutionType = 'protein'

            if(extractionMethod){
                diagnosis.protein = getExtractionAdvice(extractionMethod, 'low280')
            }


        }


        else if(a280>2.2){


            pollutionList.push(
                'A260/A280偏高，可能存在RNA降解或测定误差'
            )


        }


    }




    if(hasA230){


        if(a230<1.0){


            pollutionList.push(
                'A260/A230严重偏低，提示胍盐、盐类或提取试剂残留风险'
            )

            pollutionType = pollutionType ? 'both' : 'salt'

            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, 'low230')
            }


        }


        else if(a230<1.5){


            pollutionList.push(
                'A260/A230偏低，提示盐离子、乙醇或有机物残留风险'
            )

            pollutionType = pollutionType ? 'both' : 'salt'

            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, 'low230')
            }


        }


        else if(a230<2.0){


            pollutionList.push(
                'A260/A230略低，存在轻微残留风险'
            )

            pollutionType = pollutionType ? 'both' : 'salt'

            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, 'low230')
            }


        }


    }




    if(pollutionList.length===0){


        if(hasA280 || hasA230){

            pollution =
            '未发现明显污染'

        }

        else{

            pollution =
            '暂无纯度数据'

        }


    }

    else{


        pollution =
        pollutionList.join('；')


    }



    if(
        quality==='待检测'
    ){


        suggestion =
        '请输入A260/A280数据后进行RNA质量评价'


    }


    else if(
        quality==='优秀'
        &&
        pollution==='未发现明显污染'

    ){


        suggestion =
        'RNA质量良好，可直接用于反转录及RT-qPCR实验。' + (appConfig.advice || '')


    }


    else if(
        quality==='较差'

    ){


        suggestion = buildFullSuggestion(diagnosis, appConfig, extractionMethod)


    }


    else if(pollutionType && extractionMethod){


        suggestion = buildFullSuggestion(diagnosis, appConfig, extractionMethod)


    }


    else{

        suggestion = appConfig.advice || 'RNA基本可使用，建议结合实验需求评估是否需要进一步纯化'

    }



    return {


        quality,

        pollution,

        suggestion,

        pollutionType,

        diagnosis


    }


}


function buildFullSuggestion(diagnosis, appConfig, extractionMethod){

    let parts = []

    if(diagnosis.protein){
        parts.push(
            `【蛋白/酚类污染】\n` +
            `可能原因：${diagnosis.protein.reason.join('；')}\n` +
            `问题步骤：${diagnosis.protein.step.join('；')}\n` +
            `优化建议：${diagnosis.protein.optimization.join('；')}`
        )
    }

    if(diagnosis.salt){
        parts.push(
            `【盐类/试剂残留】\n` +
            `可能原因：${diagnosis.salt.reason.join('；')}\n` +
            `问题步骤：${diagnosis.salt.step.join('；')}\n` +
            `优化建议：${diagnosis.salt.optimization.join('；')}`
        )
    }

    if(appConfig?.advice){
        parts.push(
            `【下游实验建议】\n${appConfig.advice}`
        )
    }

    return parts.join('\n\n')
}

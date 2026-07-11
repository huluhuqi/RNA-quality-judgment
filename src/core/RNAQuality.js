/**
 * RNA质量分析
 */


export function analyzeRNA(sample){


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




    if(!hasA280){


        quality = '待检测'


    }

    else if(
        a280>=1.9 &&
        a280<=2.1
    ){

        quality='优秀'

    }

    else if(
        a280>=1.8 &&
        a280<=2.2
    ){

        quality='良好'

    }

    else if(
        a280>=1.7 &&
        a280<=2.3
    ){

        quality='一般'

    }

    else{

        quality='较差'

    }




    let pollutionList=[]




    if(hasA280){


        if(a280<1.8){

            pollutionList.push(
                'A260/A280偏低，提示蛋白质或酚类污染风险'
            )

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


        }

        else if(a230<1.5){


            pollutionList.push(
                'A260/A230偏低，提示盐离子、乙醇或有机物残留风险'
            )


        }

        else if(a230<2.0){


            pollutionList.push(
                'A260/A230略低，存在轻微残留风险'
            )


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
        'RNA质量良好，可直接用于反转录及RT-qPCR实验'


    }


    else if(

        quality==='较差'

    ){


        suggestion =
        'RNA纯度异常，建议检查提取过程，必要时进行RNA纯化并重新检测'


    }


    else{


        suggestion =
        'RNA基本可使用，建议结合实验需求评估是否需要进一步纯化'


    }





    return {

        quality,

        pollution,

        suggestion

    }


}

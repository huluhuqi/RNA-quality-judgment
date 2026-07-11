/**
 * RNA质量分析
 *
 * 输入：
 * {
 *  concentration,
 *  a260280,
 *  a260230
 * }
 *
 * 输出：
 * {
 *  quality,
 *  pollution,
 *  suggestion
 * }
 */


export function analyzeRNA(sample){


    const a280 = Number(sample.a260280)

    const a230 = Number(sample.a260230)



    let quality = ''

    let pollution = ''

    let suggestion = ''



    /*
        A260/A280判断

        优秀：
        1.9-2.1

        良好：
        1.8-2.2

        一般：
        1.7-2.3

        较差：
        其他
    */


    if(!a280){


        quality = '无法判断'


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




    /*
        污染判断
    */


    let pollutionList=[]



    if(a280 && a280<1.8){

        pollutionList.push(
            '蛋白质或酚类污染风险'
        )

    }



    if(a230){


        if(a230<1){


            pollutionList.push(
                '严重盐类、胍盐或试剂残留'
            )


        }
        else if(a230<1.5){


            pollutionList.push(
                '盐离子、乙醇或提取试剂残留'
            )


        }
        else if(a230<2){


            pollutionList.push(
                '轻微有机物或盐类残留风险'
            )

        }



    }



    if(
        pollutionList.length===0
    ){

        pollution =
        '未发现明显污染'


    }
    else{


        pollution =
        pollutionList.join('；')


    }





    /*
        建议
    */


    if(
        quality==='优秀' &&
        pollution==='未发现明显污染'
    ){


        suggestion=
        'RNA质量良好，可直接用于反转录及RT-qPCR实验'


    }
    else if(
        quality==='较差' ||
        pollution.includes('严重')
    ){


        suggestion=
        '建议进一步纯化RNA，并重新检测纯度及完整性'


    }
    else{


        suggestion=
        'RNA基本可使用，建议根据实验要求评估是否需要优化处理'


    }



    return {

        quality,

        pollution,

        suggestion

    }


}

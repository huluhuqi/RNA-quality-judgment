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

            warning:'无有效RNA浓度',

            suggestion:'请输入RNA浓度'

        }

    }






    // 最低浓度决定整个批次

    const minConcentration =
        Math.min(...concentrations)





    /*
    
    最大可投入RNA量

    = 最低浓度 × 最大模板体积

    */


    const maxPossibleRNA =

        minConcentration
        *
        config.maxVolume






    /*
    
    推荐RNA量

    取：
    
    最大可用量
    和
    试剂盒最大量
    
    两者较小值

    */


    let recommendedRNA = Math.min(

        maxPossibleRNA,

        config.maxRNA

    )






    // 保留整数

    recommendedRNA =
        Math.floor(recommendedRNA)







    let warning=''

    let suggestion=''






    // 判断是否低于最低投入


    if(
        recommendedRNA
        <
        config.minRNA
    ){


        warning =
        '当前RNA浓度过低，无法满足最低反转录投入量'


        suggestion =
        '建议重新纯化RNA或进行浓缩处理后再进行反转录'


    }

    else{



        warning =
        '模板量满足反转录要求'



        suggestion =

        `建议本批次所有样本统一投入${recommendedRNA}ng RNA进行反转录`

    }







    // 计算模板体积范围


    const volumes = concentrations.map(

        c=>

        recommendedRNA / c

    )



    const minVolume =
        Math.min(...volumes)


    const maxVolume =
        Math.max(...volumes)






    // 最大体积风险


    if(
        maxVolume >
        config.maxVolume
    ){


        warning +=

        '；部分样本模板体积超过限制'


        suggestion +=

        '；建议降低RNA投入量或浓缩低浓度样本'

    }




    return {


        recommendedRNA,


        minVolume:Number(
            minVolume.toFixed(2)
        ),


        maxVolume:Number(
            maxVolume.toFixed(2)
        ),


        warning,


        suggestion,


        minConcentration



    }



}

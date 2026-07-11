import { analyzeRNA } from './RNAQuality'


export function calculateBatch(samples){


    if(!samples || samples.length===0){

        return {

            count:0,

            avgConcentration:0,

            minConcentration:0,

            maxConcentration:0,

            avgA260280:0,

            avgA260230:0,

            quality:'暂无数据',

            pollution:'暂无数据',

            abnormal:0

        }

    }



    // 浓度

    const concentrations =
        samples
        .map(i=>Number(i.concentration))
        .filter(i=>!isNaN(i))



    // A260/A280

    const a280 =
        samples
        .map(i=>Number(i.a260280))
        .filter(i=>!isNaN(i))



    // A260/A230

    const a230 =
        samples
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
        samples.map(i=>analyzeRNA(i))





    // 质量统计

    let excellent=0

    let good=0

    let normal=0

    let bad=0



    results.forEach(r=>{


        if(r.quality==='优秀')
            excellent++


        else if(r.quality==='良好')
            good++


        else if(r.quality==='一般')
            normal++


        else if(r.quality==='较差')
            bad++


    })





    let quality=''


    if(bad>samples.length*0.3){

        quality='较差'

    }
    else if(
        excellent+good
        >
        samples.length*0.8
    ){

        quality='良好'

    }
    else{

        quality='一般'

    }






    // 污染统计


    let pollutionCount=0


    results.forEach(r=>{


        if(
            r.pollution!=='未发现明显污染'
        ){

            pollutionCount++

        }

    })



    return {


        count:samples.length,


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



        quality,



        pollution:

        pollutionCount===0

        ?

        '未发现明显污染'

        :

        `发现${pollutionCount}个样本存在污染风险`,



        abnormal:

            bad



    }


}

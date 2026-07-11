import { analyzeRNA } from './RNAQuality'



export function calculateBatch(samples){


    const totalCount =
        samples.length



    const ignoredSamples =
        samples.filter(
            item=>item.ignored
        )



    const activeSamples =
        samples.filter(
            item=>!item.ignored
        )



    const ignoredCount =
        ignoredSamples.length






    const analysisResults =
        activeSamples.map(
            item=>({

                sample:item,

                result:
                analyzeRNA(item)

            })
        )




    const pendingSamples =
        analysisResults.filter(
            item=>
            item.result.quality==='待检测'
        )



    const testedSamples =
        analysisResults.filter(
            item=>
            item.result.quality!=='待检测'
        )





    const concentrations =
        activeSamples

        .map(
            item=>
            Number(item.concentration)
        )

        .filter(
            value=>
            !isNaN(value)
            &&
            value>0
        )




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




    const qualityCount={


        优秀:0,

        良好:0,

        一般:0,

        较差:0,


        待检测:
        pendingSamples.length


    }



    testedSamples.forEach(item=>{


        const q =
        item.result.quality



        if(
            qualityCount[q]
            !==undefined
        ){

            qualityCount[q]++

        }


    })






    const qualitySampleCount =
        testedSamples.length






    let overallQuality='暂无数据'



    if(
        qualitySampleCount>0
    ){


        const goodRate =

        (
            qualityCount.优秀
            +
            qualityCount.良好

        )
        /
        qualitySampleCount





        const excellentRate =

        qualityCount.优秀
        /
        qualitySampleCount





        const badRate =

        qualityCount.较差
        /
        qualitySampleCount






        if(

            excellentRate>=0.8

            &&

            badRate<=0.05

        ){


            overallQuality='优秀'


        }


        else if(

            goodRate>=0.8

        ){


            overallQuality='良好'


        }


        else if(

            badRate>=0.3

        ){


            overallQuality='较差'


        }


        else{


            overallQuality='一般'


        }


    }







    const pollutionSamples=[]



    analysisResults.forEach(item=>{


        if(

            item.result.pollution
            !==
            '未发现明显污染'

            &&

            item.result.pollution
            !==
            '暂无纯度数据'

        ){


            pollutionSamples.push({

                id:
                item.sample.id,


                pollution:
                item.result.pollution


            })

        }


    })





    let pollutionSummary=''



    if(
        pollutionSamples.length===0
    ){


        pollutionSummary=
        '未发现明显污染风险'


    }

    else{


        pollutionSummary=

        `发现${pollutionSamples.length}个样本存在污染风险，主要包括A260/A280异常导致的蛋白/酚类污染风险，以及A260/A230偏低导致的盐类、胍盐或试剂残留风险。`


    }









    return {


        totalCount,


        validCount:
        activeSamples.length,


        ignoredCount,



        pendingCount:
        pendingSamples.length,




        avgConcentration:
        Number(
            average(concentrations)
            .toFixed(2)
        ),



        minConcentration:

        concentrations.length

        ?

        Math.min(
            ...concentrations
        )

        :

        0,



        maxConcentration:

        concentrations.length

        ?

        Math.max(
            ...concentrations
        )

        :

        0,




        quality:

        overallQuality,



        qualityCount,





        pollution:

        pollutionSummary,


        pollutionSamples



    }



}

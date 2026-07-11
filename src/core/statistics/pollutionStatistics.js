/**
 * 污染统计
 *
 * 统计：
 *   - 污染类型计数（蛋白或酚类污染/盐类或试剂残留/双重污染风险）
 *   - 异常样本列表（id/pollution/suggestion）
 *   - 污染概况文本
 */
export function getPollutionStatistics(analysisResults){


    const pollutionSamples = [];

    const pollutionCount = {
        蛋白或酚类污染: 0,
        盐类或试剂残留: 0,
        双重污染风险: 0
    };


    analysisResults.forEach(item => {

        const pType = item.result.pollutionType;

        if(pType){

            if(pType === "both"){
                pollutionCount.双重污染风险++;
            }
            else if(pType === "protein"){
                pollutionCount.蛋白或酚类污染++;
            }
            else if(pType === "salt"){
                pollutionCount.盐类或试剂残留++;
            }


            pollutionSamples.push({
                id: item.sample.id,
                pollution: item.result.pollution,
                suggestion: item.result.suggestion
            });

        }

    });


    // 污染概况文本
    let pollutionSummary = "";

    if(pollutionSamples.length === 0){
        pollutionSummary = "未发现明显污染风险";
    }
    else{
        pollutionSummary =
            `发现${pollutionSamples.length}个样本存在污染风险，主要包括A260/A280异常导致的蛋白/酚类污染风险，以及A260/A230偏低导致的盐类、胍盐或试剂残留风险。`;
    }


    return {
        pollutionCount,
        pollutionSamples,
        pollutionSummary
    };


}

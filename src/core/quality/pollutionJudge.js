/**
 * 污染判断
 *
 * 保留原有 pollutionType 与 diagnosis 字段，
 * 供 BatchStatistics 统计及建议生成使用。
 */
import { getExtractionAdvice } from "../../config/getExtractionDiagnosis";


export function judgePollution(sample, extractionMethod){


    const a280 = parseFloat(sample.a260280);
    const a230 = parseFloat(sample.a260230);

    const hasA280 = !isNaN(a280);
    const hasA230 = !isNaN(a230);


    // 标志位（便于外部简单判断）
    const flags = {
        protein: false,
        phenol: false,
        salt: false,
        guanidine: false,
        unknown: false
    };


    let pollutionType = null;
    const diagnosis = {
        protein: null,
        salt: null
    };
    const pollutionList = [];


    /*
    A260/280偏低 → 蛋白质、酚类污染风险
    */
    if(hasA280 && a280 < 1.8){
        flags.protein = true;
        flags.phenol = true;
        pollutionType = "protein";
        pollutionList.push("A260/A280偏低，提示蛋白质或酚类污染风险");
        if(extractionMethod){
            diagnosis.protein = getExtractionAdvice(extractionMethod, "low280");
        }
    }
    /*
    A260/280偏高 → RNA降解或测定误差
    */
    else if(hasA280 && a280 > 2.2){
        pollutionList.push("A260/A280偏高，可能存在RNA降解或测定误差");
    }


    /*
    A260/230偏低 → 盐、胍盐、试剂残留
    */
    if(hasA230){
        if(a230 < 1.0){
            flags.salt = true;
            flags.guanidine = true;
            pollutionType = pollutionType ? "both" : "salt";
            pollutionList.push("A260/A230严重偏低，提示胍盐、盐类或提取试剂残留风险");
            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, "low230");
            }
        }
        else if(a230 < 1.5){
            flags.salt = true;
            flags.guanidine = true;
            pollutionType = pollutionType ? "both" : "salt";
            pollutionList.push("A260/A230偏低，提示盐离子、乙醇或有机物残留风险");
            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, "low230");
            }
        }
        else if(a230 < 2.0){
            flags.salt = true;
            pollutionType = pollutionType ? "both" : "salt";
            pollutionList.push("A260/A230略低，存在轻微残留风险");
            if(extractionMethod){
                diagnosis.salt = getExtractionAdvice(extractionMethod, "low230");
            }
        }
    }


    /*
    A260/230未检测时，提示盐类污染无法评估
    */
    if(hasA280 && !hasA230){
        pollutionList.push("未检测A260/230，盐类污染风险无法评估");
    }


    // 污染文本
    let pollutionText = "";
    if(pollutionList.length === 0){
        if(hasA280 || hasA230){
            pollutionText = "未发现明显污染";
        } else {
            pollutionText = "暂无纯度数据";
        }
    } else {
        pollutionText = pollutionList.join("；");
    }


    return {
        flags,
        pollutionType,
        diagnosis,
        pollutionText
    };


}

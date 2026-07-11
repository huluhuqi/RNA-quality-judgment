/**
 * 建议生成
 *
 * 保留原有分层建议逻辑：
 *   - 待检测 → 输入提示
 *   - 优秀且无污染 → 直接可用
 *   - 较差 / 存在污染且配提取方法 → 详细诊断建议
 *   - 其它 → 下游应用通用建议
 */
import { downstreamApplications } from "../../config/downstreamApplication";


export function buildSuggestion(quality, pollution, application, extractionMethod){


    const appConfig = downstreamApplications[application] || downstreamApplications.qPCR;
    const pollutionType = pollution.pollutionType;
    const diagnosis = pollution.diagnosis;


    // 待检测
    if(quality === "待检测"){
        return "请输入A260/A280数据后进行RNA质量评价";
    }


    // 优秀且无污染
    if(quality === "优秀" && pollution.pollutionText === "未发现明显污染"){
        return "RNA质量良好，可直接用于反转录及RT-qPCR实验。" + (appConfig.advice || "");
    }


    // 较差
    if(quality === "较差"){
        return buildFullSuggestion(diagnosis, appConfig, extractionMethod);
    }


    // 存在污染且配提取方法
    if(pollutionType && extractionMethod){
        return buildFullSuggestion(diagnosis, appConfig, extractionMethod);
    }


    // 其它
    return appConfig.advice || "RNA基本可使用，建议结合实验需求评估是否需要进一步纯化";


}


/**
 * 组装诊断详情
 */
function buildFullSuggestion(diagnosis, appConfig, extractionMethod){

    let parts = [];

    if(diagnosis.protein){
        parts.push(
            "【蛋白/酚类污染】\n" +
            "可能原因：" + diagnosis.protein.reason.join("；") + "\n" +
            "问题步骤：" + diagnosis.protein.step.join("；") + "\n" +
            "优化建议：" + diagnosis.protein.optimization.join("；")
        );
    }

    if(diagnosis.salt){
        parts.push(
            "【盐类/试剂残留】\n" +
            "可能原因：" + diagnosis.salt.reason.join("；") + "\n" +
            "问题步骤：" + diagnosis.salt.step.join("；") + "\n" +
            "优化建议：" + diagnosis.salt.optimization.join("；")
        );
    }

    if(appConfig?.advice){
        parts.push("【下游实验建议】\n" + appConfig.advice);
    }

    return parts.join("\n\n");


}

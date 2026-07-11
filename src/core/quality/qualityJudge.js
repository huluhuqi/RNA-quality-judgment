/**
 * RNA质量评级
 *
 * 保留原有基于下游应用配置的评分逻辑：
 *   - 有应用配置时按 requirements 评分
 *   - 无应用配置时回退到 QUALITY_STANDARD
 */
import { QUALITY_STANDARD } from "./constants";
import { downstreamApplications } from "../../config/downstreamApplication";


export function judgeQuality(sample, application){


    const a280 = parseFloat(sample.a260280);
    const a230 = parseFloat(sample.a260230);

    const hasA280 = !isNaN(a280);


    // 无浓度比值
    if(!hasA280){
        return "待检测";
    }


    const appConfig = downstreamApplications[application] || downstreamApplications.qPCR;
    const req = appConfig.requirements;

    const [min280, max280] = req.a280;
    const req230 = req.a230;

    let score = 0;
    let total = 0;

    if(hasA280){
        total++;
        if(a280 >= min280 && a280 <= max280){
            score++;
        } else if(a280 >= min280 - 0.1 && a280 <= max280 + 0.1){
            score += 0.5;
        }
    }

    const hasA230 = !isNaN(a230);
    if(hasA230){
        total++;
        if(a230 >= req230){
            score++;
        } else if(a230 >= req230 - 0.3){
            score += 0.5;
        }
    }

    const ratio = score / total;

    if(ratio >= 1){
        return "优秀";
    }
    if(ratio >= 0.75){
        return "良好";
    }
    if(ratio >= 0.5){
        return "一般";
    }
    return "较差";


}

/**
 * RNA质量评分算法
 *
 * 评分规则（总分100分）：
 *   - A260/280：40分权重
 *   - A260/230：40分权重
 *   - 综合风险：20分权重（自动计算）
 *
 * 等级对应：
 *   - 90-100：优秀（excellent）
 *   - 75-90：良好（good）
 *   - 60-75：一般（warning）
 *   - 40-60：较差（poor）
 *   - <40：不合格（fail）
 */
import { QUALITY_STANDARDS } from "../../config/qualityStandards";
import { QUALITY_LEVEL } from "../../config/qualityLevel";


/**
 * 计算RNA质量评分
 *
 * @param {Object} sample 样本数据（包含 a260280, a260230）
 * @param {string} application 下游实验用途（normal/qpcr/rnaseq/smallRNA）
 * @returns {Object} { score, level, levelValue, detail, riskMessage }
 */
export function calculateRNAQuality(sample, application = "normal") {

    const standard = QUALITY_STANDARDS[application] || QUALITY_STANDARDS.normal;

    let score = 100;
    let detail = [];

    // A260/280 评分（权重40分）
    if (sample.a260280 !== null) {
        const a280 = Number(sample.a260280);
        const result = scoreA260280(a280, standard.a260280);
        score += result.score;
        detail.push(result.message);
    } else {
        score -= 40;
        detail.push("A260/280缺失");
    }

    // A260/230 评分（权重40分）
    if (sample.a260230 !== null) {
        const result = scoreA260230(Number(sample.a260230), standard.a260230);
        score += result.score;
        detail.push(result.message);
    } else {
        score -= 20;
        detail.push("A260/230未检测");
    }

    score = Math.max(0, Math.min(100, score));

    const levelInfo = getLevelInfo(score);

    return {
        score: Math.round(score),
        level: levelInfo.label,
        levelValue: levelInfo.value,
        detail,
        riskMessage: getRiskMessage(score)
    };

}


/**
 * A260/280 评分
 */
function scoreA260280(value, range) {
    if (value >= range.ideal[0] && value <= range.ideal[1]) {
        return { score: 0, message: "A260/280正常" };
    }
    if (value >= range.warning[0] && value <= range.warning[1]) {
        return { score: -10, message: "A260/280轻度偏离" };
    }
    return { score: -30, message: "A260/280异常" };
}


/**
 * A260/230 评分
 */
function scoreA260230(value, standard) {
    if (value >= standard.ideal) {
        return { score: 0, message: "A260/230正常" };
    }
    if (value >= standard.warning) {
        return { score: -15, message: "A260/230轻度偏低" };
    }
    return { score: -35, message: "A260/230明显异常" };
}


/**
 * 根据评分获取等级信息
 */
function getLevelInfo(score) {
    if (score >= 90) {
        return { label: "优秀", value: QUALITY_LEVEL.EXCELLENT.value };
    }
    if (score >= 75) {
        return { label: "良好", value: QUALITY_LEVEL.GOOD.value };
    }
    if (score >= 60) {
        return { label: "一般", value: QUALITY_LEVEL.WARNING.value };
    }
    if (score >= 40) {
        return { label: "较差", value: QUALITY_LEVEL.POOR.value };
    }
    return { label: "不合格", value: QUALITY_LEVEL.FAIL.value };
}


/**
 * 获取风险提示信息
 */
function getRiskMessage(score) {
    if (score >= 90) {
        return "RNA质量优秀，适合所有下游实验";
    }
    if (score >= 75) {
        return "RNA质量良好，常规实验可用";
    }
    if (score >= 60) {
        return "RNA存在轻度风险，建议复测或优化纯化步骤";
    }
    if (score >= 40) {
        return "RNA质量风险较高，建议重新纯化";
    }
    return "RNA质量较差，不建议使用";
}

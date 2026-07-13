export function evaluateApplication(quality, purpose) {
    if (!quality || !purpose) {
        return "满足当前实验用途要求";
    }

    if (purpose === "rnaseq") {
        if (quality.score !== null && quality.score < 80) {
            return "RNA质量可能影响建库结果，建议优化纯化";
        }
        return "RNA质量满足RNA-seq要求";
    }

    if (purpose === "microarray") {
        if (quality.score !== null && quality.score < 80) {
            return "RNA质量可能影响芯片杂交信号，建议优化纯化";
        }
        return "RNA质量满足基因芯片要求";
    }

    if (purpose === "qpcr") {
        if (quality.score !== null && quality.score < 60) {
            return "RNA质量可能影响逆转录效率和Ct稳定性";
        }
        return "RNA质量满足qPCR要求";
    }

    if (purpose === "rtpcr") {
        if (quality.score !== null && quality.score < 50) {
            return "RNA质量偏低，可能影响RT-PCR结果";
        }
        return "RNA质量满足普通RT-PCR要求";
    }

    return "满足当前实验用途要求";
}
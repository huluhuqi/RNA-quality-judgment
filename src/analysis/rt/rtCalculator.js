import { classifyRNAConcentration } from "./concentrationClassifier";

const CONFIG = {
    targetRNAAmount: 1000,
    maxRNAInputVolume: 10
};

export function calculateRT(concentration) {
    const level = classifyRNAConcentration(concentration);

    if (level.level === "unknown") {
        return {
            status: "无法计算",
            inputVolume: null,
            rnaAmount: null,
            message: level.message
        };
    }

    const c = Number(concentration);

    if (level.level === "low") {
        const volume = CONFIG.targetRNAAmount / c;

        if (volume > CONFIG.maxRNAInputVolume) {
            const actualVolume = CONFIG.maxRNAInputVolume;
            const actualAmount = c * actualVolume;
            return {
                status: "浓度不足",
                inputVolume: actualVolume,
                rnaAmount: Math.round(actualAmount),
                message: "RNA浓度较低，当前最大体积无法达到推荐模板量，建议提高RNA浓度或降低RT投入量"
            };
        }
    }

    if (level.level === "normal") {
        const volume = CONFIG.targetRNAAmount / c;
        if (volume <= CONFIG.maxRNAInputVolume) {
            return {
                status: "推荐",
                inputVolume: Number(volume.toFixed(2)),
                rnaAmount: CONFIG.targetRNAAmount,
                message: "按计算体积加入RNA模板"
            };
        }
    }

    if (level.level === "high") {
        const volume = CONFIG.targetRNAAmount / c;
        if (volume < 2) {
            return {
                status: "需要稀释",
                inputVolume: Number(volume.toFixed(2)),
                rnaAmount: CONFIG.targetRNAAmount,
                message: "RNA浓度较高，建议适当稀释后加入RT体系，避免小体积移液误差"
            };
        }
        return {
            status: "推荐",
            inputVolume: Number(volume.toFixed(2)),
            rnaAmount: CONFIG.targetRNAAmount,
            message: "按计算体积加入RNA模板"
        };
    }

    return {
        status: "无法计算",
        inputVolume: null,
        rnaAmount: null,
        message: level.message
    };
}
import {
    EXTRACTION_METHODS
} from "../../config/extractionMethods";

import {
    getExtractionMethodId
} from "../../config/extractionMethodMap";

export function analyzeExtractionProblem(sample, pollution) {

    const methodId = getExtractionMethodId(sample.extractionMethod) || "other";

    const method = EXTRACTION_METHODS[methodId] || EXTRACTION_METHODS.other;

    const result = [];

    pollution.forEach(item => {

        if (item.type.includes("蛋白")) {

            result.push({
                problem: "蛋白去除不足",
                step: "裂解、分相或洗涤步骤",
                suggestion: method.advice.protein
            });

        }

        if (item.type.includes("盐") || item.type.includes("胍") || item.type.includes("试剂")) {

            result.push({
                problem: "盐类或试剂残留",
                step: "洗涤和干燥步骤",
                suggestion: method.advice.salt
            });

        }

        if (item.type.includes("酚")) {

            result.push({
                problem: "酚类残留",
                step: "TRIzol分相步骤",
                suggestion: method.advice.phenol
            });

        }

    });

    return result;

}

import { getActiveSamples } from "./sampleFilter";

export function pollutionSummary(samples) {
    const result = {};

    getActiveSamples(samples).forEach(sample => {
        const types = sample.analysis?.pollution?.types || [];

        types.forEach(type => {
            if (!result[type]) {
                result[type] = 0;
            }
            result[type]++;
        });
    });

    return result;
}
export function pollutionSummary(samples) {
    const result = {};

    samples.forEach(sample => {
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
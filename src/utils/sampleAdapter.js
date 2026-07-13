import { createSample } from "@/models/SampleModel";

export function normalizeSamples(list) {
    return list.map(item => createSample(item));
}

export function normalizeSample(data) {
    return createSample(data);
}
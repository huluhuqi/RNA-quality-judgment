export const applications = [
    {
        label: "qPCR检测",
        value: "qpcr",
        quality: "normal"
    },
    {
        label: "RNA-seq",
        value: "rnaseq",
        quality: "high"
    },
    {
        label: "基因芯片",
        value: "microarray",
        quality: "high"
    },
    {
        label: "普通RT-PCR",
        value: "rtpcr",
        quality: "normal"
    }
];

export function getApplicationLabel(value) {
    const item = applications.find(a => a.value === value);
    return item ? item.label : value;
}
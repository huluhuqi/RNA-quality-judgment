export const extractionMethods = [
    {
        label: "柱提法",
        value: "column"
    },
    {
        label: "TRIzol法",
        value: "trizol"
    },
    {
        label: "磁珠法",
        value: "beads"
    },
    {
        label: "自动化提取",
        value: "automation"
    }
];

export const EXTRACTION_METHODS = extractionMethods;

export function getExtractionMethodLabel(value) {
    const item = extractionMethods.find(m => m.value === value);
    return item ? item.label : value;
}
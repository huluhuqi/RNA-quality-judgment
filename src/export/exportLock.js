let exporting = false;

export function startExport() {
    if (exporting) return false;
    exporting = true;
    return true;
}

export function endExport() {
    exporting = false;
}

export function isExporting() {
    return exporting;
}
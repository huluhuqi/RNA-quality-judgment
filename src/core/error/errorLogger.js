const KEY = "rna_error_logs";

export function logError(error) {
    let logs = [];
    try {
        logs = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        logs = [];
    }

    logs.push({
        ...error,
        timestamp: Date.now()
    });

    if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
    }

    try {
        localStorage.setItem(KEY, JSON.stringify(logs));
    } catch (e) {
        console.warn("错误日志保存失败", e);
    }
}

export function getErrorLogs() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

export function clearErrorLogs() {
    localStorage.removeItem(KEY);
}
const cache = new Map();

export function getAnalysisCache(id) {
    return cache.get(id);
}

export function setAnalysisCache(id, data) {
    cache.set(id, data);
}

export function clearAnalysisCache() {
    cache.clear();
}

export function hasAnalysisCache(id) {
    return cache.has(id);
}
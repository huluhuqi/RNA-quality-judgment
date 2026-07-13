export function safeParse(data) {
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        console.warn("缓存损坏", e);
        return null;
    }
}

export function safeStringify(data) {
    try {
        return JSON.stringify(data);
    } catch (e) {
        console.warn("JSON序列化失败", e);
        return null;
    }
}
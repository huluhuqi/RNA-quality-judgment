export function migrate(oldData, version) {
    if (!oldData) return null;
    
    try {
        switch (version) {
            case 1:
                return oldData;
            case 2:
                return migrateV1toV2(oldData);
            default:
                return oldData;
        }
    } catch (e) {
        console.warn("数据迁移失败", e);
        return oldData;
    }
}

function migrateV1toV2(data) {
    if (!Array.isArray(data)) return data;
    return data.map(item => {
        if (item && typeof item === 'object') {
            return {
                ...item,
                source: item.source || 'manual'
            };
        }
        return item;
    });
}

export function getCurrentVersion() {
    return 1;
}
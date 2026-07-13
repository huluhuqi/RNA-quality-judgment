/**
 * 样本分析结果缓存
 *
 * 性能优化：避免重复分析同一样本
 * 
 * 缓存策略：
 * 1. 使用 Map 存储分析结果（key = sample.id）
 * 2. 样本数据变化时清除对应缓存
 * 3. 批量导入时增量缓存
 */

// 缓存存储
const cache = new Map();

// 缓存统计（调试用）
let hitCount = 0;
let missCount = 0;

/**
 * 获取缓存的分析结果
 * 
 * @param {string} id 样本ID
 * @returns {Object|null} 缓存结果或null
 */
export function getAnalysisCache(id) {
    const result = cache.get(id);
    if (result) {
        hitCount++;
    }
    return result || null;
}

/**
 * 设置分析结果缓存
 * 
 * @param {string} id 样本ID
 * @param {Object} result 分析结果
 */
export function setAnalysisCache(id, result) {
    cache.set(id, result);
    missCount++;
}

/**
 * 检查是否存在缓存
 * 
 * @param {string} id 样本ID
 * @returns {boolean}
 */
export function hasAnalysisCache(id) {
    return cache.has(id);
}

/**
 * 清除单个样本缓存
 * 
 * @param {string} id 样本ID
 */
export function clearAnalysisCache(id) {
    cache.delete(id);
}

/**
 * 清除所有缓存
 */
export function clearAllAnalysisCache() {
    cache.clear();
    hitCount = 0;
    missCount = 0;
}

/**
 * 获取缓存统计信息
 * 
 * @returns {Object} { size, hitCount, missCount, hitRate }
 */
export function getCacheStats() {
    const total = hitCount + missCount;
    return {
        size: cache.size,
        hitCount,
        missCount,
        hitRate: total > 0 ? (hitCount / total * 100).toFixed(1) + '%' : '0%'
    };
}

/**
 * 批量设置缓存
 * 
 * @param {Array} samples 带有 result 字段的样本数组
 */
export function batchSetCache(samples) {
    samples.forEach(sample => {
        if (sample.id && sample.result) {
            cache.set(sample.id, sample.result);
        }
    });
}
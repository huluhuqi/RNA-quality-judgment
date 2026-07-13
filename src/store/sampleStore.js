/**
 * RNA样本状态管理
 *
 * 性能优化策略：
 * 1. 使用 shallowRef 避免深层响应式监听（大数组性能）
 * 2. 分析结果缓存（避免重复计算）
 * 3. 批次统计脏检查（按需更新）
 * 4. 样本变更增量更新（而非全量重新计算）
 */
import { shallowRef, ref, computed, markRaw } from 'vue';
import { getValidSamples } from '../core/sample/sampleUtils';

// ==================== 样本数据 ====================
// 使用 shallowRef 避免大数组深层响应式
export const samples = shallowRef([]);

// ==================== 缓存状态 ====================
// 批次统计缓存
export const summaryCache = ref(null);

// 脏标记（是否需要重新计算批次统计）
export const isDirty = ref(true);

// ==================== 派生状态（computed） ====================
// 有效样本数量
export const validCount = computed(() => getValidSamples(samples.value).length);

// 忽略样本数量
export const ignoredCount = computed(() => 
    samples.value.filter(s => s.ignored).length
);

// 有效样本列表
export const validSamples = computed(() => getValidSamples(samples.value));

// ==================== 操作方法 ====================

/**
 * 设置样本数据
 * 
 * @param {Array} data 样本数组
 */
export function setSamples(data) {
    samples.value = data;
    markDirty();
}

/**
 * 更新单个样本
 * 
 * @param {number} index 样本索引
 * @param {Object} updates 更新内容
 */
export function updateSample(index, updates) {
    if (index < 0 || index >= samples.value.length) return;
    
    const newSamples = [...samples.value];
    newSamples[index] = { ...newSamples[index], ...updates };
    samples.value = newSamples;
    markDirty();
}

/**
 * 添加样本
 * 
 * @param {Object|Array} sample 单个样本或样本数组
 */
export function addSamples(sample) {
    const toAdd = Array.isArray(sample) ? sample : [sample];
    samples.value = [...samples.value, ...toAdd];
    markDirty();
}

/**
 * 删除样本
 * 
 * @param {number} index 样本索引
 */
export function removeSample(index) {
    if (index < 0 || index >= samples.value.length) return;
    
    const newSamples = samples.value.filter((_, i) => i !== index);
    samples.value = newSamples;
    markDirty();
}

/**
 * 切换忽略状态
 * 
 * @param {number} index 样本索引
 */
export function toggleIgnore(index) {
    if (index < 0 || index >= samples.value.length) return;
    
    const sample = samples.value[index];
    updateSample(index, { ignored: !sample.ignored });
}

/**
 * 清空所有样本
 */
export function clearSamples() {
    samples.value = [];
    summaryCache.value = null;
    isDirty.value = true;
}

/**
 * 标记数据为脏（需要重新计算）
 */
export function markDirty() {
    isDirty.value = true;
}

/**
 * 标记数据为干净（已计算完成）
 */
export function markClean() {
    isDirty.value = false;
}

/**
 * 更新批次统计缓存
 * 
 * @param {Object} summary 批次统计结果
 */
export function updateSummaryCache(summary) {
    // 使用 markRaw 避免大型对象进入响应式系统
    summaryCache.value = markRaw(summary);
    markClean();
}

/**
 * 获取批次统计（优先使用缓存）
 * 
 * @param {Function} calculator 计算函数
 * @returns {Object} 批次统计结果
 */
export function getSummary(calculator) {
    if (isDirty.value || !summaryCache.value) {
        const result = calculator(samples.value);
        updateSummaryCache(result);
    }
    return summaryCache.value;
}

/**
 * 批量更新样本（性能优化版本）
 * 
 * @param {Function} updater 更新函数 (sample, index) => updatedSample
 */
export function batchUpdateSamples(updater) {
    const newSamples = samples.value.map((sample, index) => {
        const result = updater(sample, index);
        return result || sample;
    });
    samples.value = newSamples;
    markDirty();
}
<script setup>
/**
 * RNA 虚拟滚动表格
 *
 * 用于大数据量场景（500-10000+样本）
 * 只渲染可视区域内的行，大幅提升性能
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getQualityLabel } from '@/config/qualityLevel';
import { calculateVirtualScroll } from '@/utils/pagination';

const props = defineProps({
    samples: {
        type: Array,
        default: () => []
    },
    itemHeight: {
        type: Number,
        default: 50
    },
    containerHeight: {
        type: Number,
        default: 600
    }
});

const emit = defineEmits(['delete', 'ignore', 'cell-change']);

// 滚动状态
const scrollTop = ref(0);
const containerRef = ref(null);

// 计算虚拟滚动参数
const virtualConfig = computed(() => {
    return calculateVirtualScroll({
        itemHeight: props.itemHeight,
        containerHeight: props.containerHeight,
        scrollTop: scrollTop.value,
        total: props.samples.length,
        buffer: 10
    });
});

// 当前可视区域的样本
const visibleSamples = computed(() => {
    const { startIndex, endIndex } = virtualConfig.value;
    return props.samples.slice(startIndex, endIndex);
});

// 处理滚动
function handleScroll(event) {
    scrollTop.value = event.target.scrollTop;
}

// 获取质量标签类型
function getTagType(quality) {
    switch (quality) {
        case 'excellent': return 'success';
        case 'good': return '';
        case 'warning': return 'warning';
        case 'poor': return 'danger';
        case 'fail': return 'danger';
        default: return 'info';
    }
}

// 处理操作
function handleDelete(sample) {
    emit('delete', sample);
}

function handleIgnore(sample) {
    emit('ignore', sample);
}

function handleCellChange(sample) {
    emit('cell-change', sample);
}

// 监听容器高度变化
let resizeObserver = null;

onMounted(() => {
    if (containerRef.value) {
        resizeObserver = new ResizeObserver(entries => {
            // 可以在这里更新容器高度
        });
        resizeObserver.observe(containerRef.value);
    }
});

onUnmounted(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
</script>

<template>
<div 
    ref="containerRef"
    class="virtual-table-container"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
>
    <!-- 总高度占位 -->
    <div 
        class="virtual-table-body" 
        :style="{ height: virtualConfig.totalHeight + 'px' }"
    >
        <!-- 可视区域内容 -->
        <table 
            class="virtual-table"
            :style="{ transform: `translateY(${virtualConfig.offsetY}px)` }"
        >
            <thead class="virtual-table-header">
                <tr>
                    <th class="col-id">模板ID</th>
                    <th class="col-concentration">浓度</th>
                    <th class="col-ratio">A260/280</th>
                    <th class="col-ratio">A260/230</th>
                    <th class="col-quality">质量</th>
                    <th class="col-pollution">污染分析</th>
                    <th class="col-suggestion">建议</th>
                    <th class="col-action">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="sample in visibleSamples" 
                    :key="sample.id"
                    class="virtual-row"
                    :class="{ ignored: sample.ignored }"
                    :style="{ height: itemHeight + 'px' }"
                >
                    <td class="col-id">
                        <el-input 
                            v-model="sample.id" 
                            size="small"
                            @change="handleCellChange(sample)"
                        />
                    </td>
                    <td class="col-concentration">
                        <el-input-number
                            v-model="sample.concentration"
                            :controls="false"
                            size="small"
                            @change="handleCellChange(sample)"
                        />
                    </td>
                    <td class="col-ratio">
                        <el-input-number
                            v-model="sample.a260280"
                            :controls="false"
                            size="small"
                            @change="handleCellChange(sample)"
                        />
                    </td>
                    <td class="col-ratio">
                        <el-input-number
                            v-model="sample.a260230"
                            :controls="false"
                            size="small"
                            @change="handleCellChange(sample)"
                        />
                    </td>
                    <td class="col-quality">
                        <el-tag :type="getTagType(sample.result?.quality)" size="small">
                            {{ getQualityLabel(sample.result?.quality) || '未判断' }}
                        </el-tag>
                        <span v-if="sample.result?.qualityScore" class="quality-score">
                            {{ sample.result.qualityScore }}分
                        </span>
                    </td>
                    <td class="col-pollution">
                        <span class="cell-text">{{ sample.result?.pollution || '-' }}</span>
                    </td>
                    <td class="col-suggestion">
                        <span class="cell-text">{{ sample.result?.suggestion || '-' }}</span>
                    </td>
                    <td class="col-action">
                        <el-button-group>
                            <el-button size="small" @click="handleIgnore(sample)">
                                {{ sample.ignored ? '恢复' : '忽略' }}
                            </el-button>
                            <el-button type="danger" size="small" @click="handleDelete(sample)">
                                删除
                            </el-button>
                        </el-button-group>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<style scoped>
.virtual-table-container {
    width: 100%;
    overflow-y: auto;
    overflow-x: auto;
    border: 1px solid var(--border-color, #e4e7ed);
    border-radius: 4px;
}

.virtual-table-body {
    position: relative;
}

.virtual-table {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 1400px;
    border-collapse: collapse;
    table-layout: fixed;
}

.virtual-table-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--table-header-bg, #f5f7fa);
}

.virtual-table-header th {
    padding: 10px 8px;
    text-align: left;
    font-weight: 600;
    color: var(--text-color, #303133);
    border-bottom: 1px solid var(--border-color, #e4e7ed);
    white-space: nowrap;
}

.virtual-row {
    transition: background-color 0.2s;
}

.virtual-row:hover {
    background: var(--row-hover-bg, #f5f7fa);
}

.virtual-row.ignored {
    opacity: 0.5;
}

.virtual-row.ignored td {
    text-decoration: line-through;
}

.virtual-row td {
    padding: 8px;
    border-bottom: 1px solid var(--border-color, #e4e7ed);
    vertical-align: middle;
}

.col-id {
    position: sticky;
    left: 0;
    z-index: 5;
    background: var(--card-bg, #ffffff);
    min-width: 140px;
}

.col-action {
    position: sticky;
    right: 0;
    z-index: 5;
    background: var(--card-bg, #ffffff);
    min-width: 180px;
}

.col-concentration {
    min-width: 120px;
}

.col-ratio {
    min-width: 130px;
}

.col-quality {
    min-width: 140px;
}

.col-pollution {
    min-width: 260px;
}

.col-suggestion {
    min-width: 300px;
}

.quality-score {
    display: block;
    font-size: 11px;
    color: var(--text-secondary, #606266);
    margin-top: 2px;
}

.cell-text {
    display: block;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    font-size: 13px;
    line-height: 1.4;
}

/* 深色主题适配 */
:deep(.dark) .virtual-table-header th {
    background: var(--table-header-bg, #2a2a2a);
}

:deep(.dark) .virtual-row:hover {
    background: var(--row-hover-bg, #333);
}
</style>
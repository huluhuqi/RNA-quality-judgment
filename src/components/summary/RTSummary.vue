<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    ok: {
        type: Number,
        default: 0
    },
    overVolume: {
        type: Number,
        default: 0
    },
    noConcentration: {
        type: Number,
        default: 0
    }
});

const volumeRange = computed(() => {
    if (props.data.minVolume && props.data.maxVolume) {
        return `${props.data.minVolume} ~ ${props.data.maxVolume} μL`;
    }
    return '-';
});
</script>

<template>

<div class="rt-summary">
    <h4 class="summary-title">RT配置统计</h4>

    <div class="rt-stats">
        <div class="stat-item">
            <span class="stat-label">可直接RT</span>
            <span class="stat-value success">{{ ok }}</span>
            <span class="stat-unit">个</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">模板超限</span>
            <span class="stat-value warning">{{ overVolume }}</span>
            <span class="stat-unit">个</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">缺少浓度</span>
            <span class="stat-value info">{{ noConcentration }}</span>
            <span class="stat-unit">个</span>
        </div>
    </div>

    <div v-if="data.recommendedRNA" class="rt-detail">
        <div class="detail-item">
            <span class="detail-label">RNA投入量</span>
            <span class="detail-value">{{ data.recommendedRNA }} ng</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">模板体积范围</span>
            <span class="detail-value">{{ volumeRange }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">最大模板体积</span>
            <span class="detail-value">12 μL</span>
        </div>
    </div>
</div>

</template>

<style scoped>

.rt-summary{
    padding: 15px;
    background: var(--card-bg, #ffffff);
    border-radius: 8px;
}

.summary-title{
    margin: 0 0 15px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color, #303133);
}

.rt-stats{
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color, #e4e7ed);
}

.stat-item{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 4px;
    background: var(--card-bg, #ffffff);
    border-radius: 6px;
    border: 1px solid var(--border-color, #e4e7ed);
}

.stat-label{
    font-size: 12px;
    color: var(--text-secondary, #606266);
}

.stat-value{
    font-size: 22px;
    font-weight: 700;
}

.stat-value.success{
    color: #67c23a;
}

.stat-value.warning{
    color: #e6a23c;
}

.stat-value.info{
    color: #909399;
}

.stat-value.danger{
    color: #f56c6c;
}

.stat-unit{
    font-size: 11px;
    color: var(--text-light, #909399);
}

.rt-detail{
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item{
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
}

.detail-label{
    font-size: 13px;
    color: var(--text-secondary, #606266);
}

.detail-value{
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color, #303133);
}

</style>

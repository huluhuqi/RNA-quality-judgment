<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    recommend: {
        type: Number,
        default: 0
    },
    cannot: {
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
    <h4 class="summary-title">RT体系配置</h4>
    
    <div class="rt-stats">
        <div class="stat-item">
            <span class="stat-label">可计算</span>
            <span class="stat-value success">{{ recommend }}</span>
            <span class="stat-unit">个</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">无法计算</span>
            <span class="stat-value warning">{{ cannot }}</span>
            <span class="stat-unit">个</span>
        </div>
    </div>

    <div v-if="data.recommendedRNA" class="rt-detail">
        <div class="detail-item">
            <span class="detail-label">推荐RNA投入量</span>
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
        <div class="detail-item">
            <span class="detail-label">浓度状态</span>
            <span class="detail-value">{{ data.level || '无法判断' }}</span>
        </div>
    </div>

    <p v-if="data.message" class="rt-message">{{ data.message }}</p>
    <p v-if="data.warning" class="rt-warning">{{ data.warning }}</p>
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
    gap: 20px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color, #e4e7ed);
}

.stat-item{
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.stat-label{
    font-size: 13px;
    color: var(--text-secondary, #606266);
}

.stat-value{
    font-size: 20px;
    font-weight: 700;
}

.stat-value.success{
    color: #67c23a;
}

.stat-value.warning{
    color: #e6a23c;
}

.stat-unit{
    font-size: 12px;
    color: var(--text-light, #909399);
}

.rt-detail{
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
}

.detail-item{
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
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

.rt-message{
    margin: 0 0 10px;
    padding: 10px;
    background: var(--card-bg, #ffffff);
    border-radius: 4px;
    line-height: 1.6;
    font-size: 13px;
    color: var(--text-color, #303133);
}

.rt-warning{
    margin: 0;
    padding: 10px;
    background: rgba(245, 108, 108, 0.1);
    color: var(--danger-color, #f56c6c);
    border-radius: 4px;
    line-height: 1.6;
    font-size: 13px;
}

</style>

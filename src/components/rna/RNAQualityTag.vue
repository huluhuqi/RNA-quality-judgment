<script setup>

import { getQualityLabel } from '@/config/qualityLevel';

const props = defineProps({
    quality: {
        type: String,
        default: 'pending'
    },
    score: {
        type: Number,
        default: null
    }
});

const displayQuality = computed(() => {
    return getQualityLabel(props.quality) || '未判断';
});

function getTagClass() {
    switch(props.quality) {
        case 'excellent': return 'excellent';
        case 'good': return 'good';
        case 'warning': return 'warning';
        case 'poor': return 'poor';
        case 'fail': return 'fail';
        default: return 'pending';
    }
}

import { computed } from 'vue';

</script>

<template>

<div class="quality-tag" :class="getTagClass()">
    <span class="quality-label">{{ displayQuality }}</span>
    <span v-if="score !== null" class="quality-score">{{ score }}分</span>
</div>

</template>

<style scoped>

.quality-tag{
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
}

.quality-tag.excellent{
    background: rgba(103, 194, 58, 0.15);
    color: #67c23a;
}

.quality-tag.good{
    background: rgba(64, 158, 255, 0.15);
    color: #409eff;
}

.quality-tag.warning{
    background: rgba(230, 162, 60, 0.15);
    color: #e6a23c;
}

.quality-tag.poor,
.quality-tag.fail{
    background: rgba(245, 108, 108, 0.15);
    color: #f56c6c;
}

.quality-tag.pending{
    background: rgba(144, 147, 153, 0.15);
    color: #909399;
}

.quality-label{
    font-size: 13px;
}

.quality-score{
    font-size: 11px;
    opacity: 0.8;
}

</style>

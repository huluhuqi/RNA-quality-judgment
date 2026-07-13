<script setup>

defineProps({
    pollution: {
        type: Array,
        default: () => []
    }
});

function getLevelClass(level) {
    switch(level) {
        case 'high': return 'level-high';
        case 'medium': return 'level-medium';
        case 'info': return 'level-info';
        case 'normal': return 'level-normal';
        default: return '';
    }
}

</script>

<template>

<div class="pollution-list">
    <div
        v-for="item in pollution"
        :key="item.type"
        class="pollution-item"
        :class="getLevelClass(item.level)"
    >
        <span class="pollution-type">{{ item.type }}</span>
        <span class="pollution-reason">{{ item.reason || item.text }}</span>
    </div>
    <div v-if="pollution.length === 0" class="empty-text">无明显污染</div>
</div>

</template>

<style scoped>

.pollution-list{
    font-size: 12px;
}

.pollution-item{
    margin-bottom: 6px;
    padding: 4px 8px;
    border-radius: 4px;
    background: rgba(0,0,0,0.03);
}

.pollution-item:last-child{
    margin-bottom: 0;
}

.pollution-item.level-high{
    background: rgba(245, 108, 108, 0.1);
    border-left: 3px solid #f56c6c;
}

.pollution-item.level-medium{
    background: rgba(230, 162, 60, 0.1);
    border-left: 3px solid #e6a23c;
}

.pollution-item.level-info{
    background: rgba(64, 158, 255, 0.08);
    border-left: 3px solid #409eff;
}

.pollution-item.level-normal{
    background: rgba(103, 194, 58, 0.08);
    border-left: 3px solid #67c23a;
}

.pollution-type{
    display: block;
    font-weight: 500;
    color: var(--text-color, #303133);
    margin-bottom: 2px;
}

.pollution-reason{
    display: block;
    color: var(--text-secondary, #606266);
    line-height: 1.4;
}

.empty-text{
    color: var(--text-light, #909399);
    font-style: italic;
}

</style>

<script setup>

defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

</script>

<template>

<div class="extraction-summary">
    <h4 class="summary-title">提取流程问题统计</h4>
    <div v-if="Object.keys(data).length > 0" class="problem-list">
        <div
            v-for="(count, problem) in data"
            :key="problem"
            class="problem-item"
        >
            <span class="problem-name">{{ problem }}</span>
            <span class="problem-count">{{ count }} 个样本</span>
        </div>
    </div>
    <div v-else class="empty-text">未发现明显提取流程问题</div>
</div>

</template>

<style scoped>

.extraction-summary{
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

.problem-list{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.problem-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(0,0,0,0.03);
    border-radius: 6px;
}

.problem-name{
    font-size: 13px;
    color: var(--text-color, #303133);
}

.problem-count{
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-color, #409eff);
}

.empty-text{
    color: var(--text-light, #909399);
    font-size: 13px;
    text-align: center;
    padding: 10px;
}

</style>

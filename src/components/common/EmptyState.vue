<script setup>

defineProps({
    title: {
        type: String,
        default: "暂无数据"
    },
    subtitle: {
        type: String,
        default: "请导入RNA样本数据开始分析"
    },
    buttonText: {
        type: String,
        default: "导入RNA数据"
    }
});

defineEmits(['action']);

</script>

<template>

<div class="empty-state">
    <div class="empty-icon">📊</div>
    <h3>{{ title }}</h3>
    <p>{{ subtitle }}</p>
    <button class="app-btn primary" @click="$emit('action')">
        {{ buttonText }}
    </button>
</div>

</template>

<style scoped>

.empty-state{
    text-align: center;
    padding: 80px 20px;
    color: var(--text-secondary, #909399);
}

.empty-icon{
    font-size: 64px;
    margin-bottom: 20px;
    opacity: 0.6;
}

.empty-state h3{
    margin: 0 0 10px;
    font-size: 20px;
    font-weight: 500;
    color: var(--text-color, #303133);
}

.empty-state p{
    margin: 0 0 30px;
    font-size: 14px;
    line-height: 1.6;
}

</style>

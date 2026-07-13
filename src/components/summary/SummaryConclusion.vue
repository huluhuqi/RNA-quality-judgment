<script setup>

const props = defineProps({
    text: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'info'
    }
});

function getTypeClass() {
    switch(props.type) {
        case 'success': return 'type-success';
        case 'warning': return 'type-warning';
        case 'danger': return 'type-danger';
        default: return 'type-info';
    }
}

</script>

<template>

<div class="summary-conclusion" :class="getTypeClass()">
    <div class="conclusion-icon">
        <span v-if="props.type === 'success'">✅</span>
        <span v-else-if="props.type === 'warning'">⚠️</span>
        <span v-else-if="props.type === 'danger'">❌</span>
        <span v-else>📊</span>
    </div>
    <div class="conclusion-text">{{ props.text }}</div>
</div>

</template>

<style scoped>

.summary-conclusion{
    display: flex;
    gap: 15px;
    padding: 20px;
    border-radius: 12px;
    line-height: 1.8;
    font-size: 15px;
}

.summary-conclusion.type-info{
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #ffffff;
}

.summary-conclusion.type-success{
    background: linear-gradient(135deg, #67c23a, #85ce61);
    color: #ffffff;
}

.summary-conclusion.type-warning{
    background: linear-gradient(135deg, #e6a23c, #ebb563);
    color: #ffffff;
}

.summary-conclusion.type-danger{
    background: linear-gradient(135deg, #f56c6c, #f89898);
    color: #ffffff;
}

.conclusion-icon{
    font-size: 28px;
    flex-shrink: 0;
}

.conclusion-text{
    flex: 1;
    white-space: pre-line;
}

</style>

<script setup>

defineProps({
    type: {
        type: String,
        default: "primary"
    },
    size: {
        type: String,
        default: "normal"
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    }
});

defineEmits(['click']);

</script>

<template>

<button
    class="app-btn"
    :class="[type, size, { disabled, loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
>
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
</button>

</template>

<style scoped>

.app-btn{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    transition: all .25s ease;
    font-size: 14px;
    font-weight: 500;
    min-width: 80px;
}

.app-btn.primary{
    background: linear-gradient(135deg, var(--primary-color, #409eff), var(--primary-light, #66b1ff));
    color: #ffffff;
}

.app-btn.primary:hover:not(.disabled):not(.loading){
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.app-btn.success{
    background: linear-gradient(135deg, #67c23a, #85ce61);
    color: #ffffff;
}

.app-btn.success:hover:not(.disabled):not(.loading){
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(103, 194, 58, 0.4);
}

.app-btn.warning{
    background: linear-gradient(135deg, #e6a23c, #ebb563);
    color: #ffffff;
}

.app-btn.warning:hover:not(.disabled):not(.loading){
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(230, 162, 60, 0.4);
}

.app-btn.danger{
    background: linear-gradient(135deg, #f56c6c, #f89898);
    color: #ffffff;
}

.app-btn.danger:hover:not(.disabled):not(.loading){
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 108, 108, 0.4);
}

.app-btn.info{
    background: var(--card-bg, #ffffff);
    color: var(--text-color, #303133);
    border: 1px solid var(--border-color, #e4e7ed);
}

.app-btn.info:hover:not(.disabled):not(.loading){
    background: rgba(64, 158, 255, 0.1);
    border-color: var(--primary-color, #409eff);
}

.app-btn.small{
    padding: 6px 12px;
    font-size: 12px;
}

.app-btn.large{
    padding: 14px 28px;
    font-size: 16px;
}

.app-btn:active:not(.disabled):not(.loading){
    transform: scale(0.96);
}

.app-btn.disabled,
.app-btn.loading{
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-spinner{
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin .6s linear infinite;
}

@keyframes spin{
    to{ transform: rotate(360deg); }
}

</style>

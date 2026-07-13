<script setup>

defineProps({
    message: {
        type: String,
        default: "正在处理..."
    },
    show: {
        type: Boolean,
        default: false
    }
});

</script>

<template>

<Transition name="fade">
    <div v-if="show" class="loading-overlay">
        <div class="loading-content">
            <div class="spinner"></div>
            <p>{{ message }}</p>
        </div>
    </div>
</Transition>

</template>

<style scoped>

.loading-overlay{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.loading-content{
    background: var(--card-bg, #ffffff);
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.spinner{
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color, #e4e7ed);
    border-top-color: var(--primary-color, #409eff);
    border-radius: 50%;
    animation: spin .8s linear infinite;
    margin: 0 auto 20px;
}

.loading-content p{
    margin: 0;
    font-size: 16px;
    color: var(--text-color, #303133);
}

@keyframes spin{
    to{ transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active{
    transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to{
    opacity: 0;
}

</style>

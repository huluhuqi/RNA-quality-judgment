<script setup>

import { ref } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    defaultOpen: {
        type: Boolean,
        default: true
    }
});

defineEmits(['toggle']);

const isOpen = ref(props.defaultOpen);

function toggle() {
    isOpen.value = !isOpen.value;
}

</script>

<template>

<section class="collapse-card">

    <div class="card-header" @click="toggle">

        <h3>{{ title }}</h3>

        <div class="header-right">
            <slot name="action" />
            <span class="collapse-icon" :class="{ expanded: isOpen }">▼</span>
        </div>

    </div>

    <Transition name="collapse">
        <div v-show="isOpen" class="card-body">
            <slot />
        </div>
    </Transition>

</section>

</template>

<style scoped>

.collapse-card{
    background: var(--card-bg, #ffffff);
    border-radius: 14px;
    margin-bottom: 20px;
    overflow: hidden;
    transition: all .3s ease;
    border: 1px solid var(--border-color, #e4e7ed);
}

.card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    cursor: pointer;
    user-select: none;
}

.card-header:hover{
    background: rgba(0,0,0,0.03);
}

.card-header h3{
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color, #303133);
}

.header-right{
    display: flex;
    align-items: center;
    gap: 10px;
}

.collapse-icon{
    font-size: 12px;
    color: var(--text-secondary, #909399);
    transition: transform .25s ease;
}

.collapse-icon.expanded{
    transform: rotate(180deg);
}

.card-body{
    padding: 20px;
    border-top: 1px solid var(--border-color, #e4e7ed);
}

.collapse-enter-active,
.collapse-leave-active{
    transition: all .3s ease;
    overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to{
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}

.collapse-enter-to,
.collapse-leave-from{
    max-height: 2000px;
}

</style>

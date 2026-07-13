<script setup>
import { computed } from 'vue'
import { getErrorMessage } from '@/core/error/errorRecovery'

const props = defineProps({
    message: String,
    type: String,
    showRecovery: {
        type: Boolean,
        default: true
    }
})

const recoveryText = computed(() => {
    if (!props.type || !props.showRecovery) return ''
    return getErrorMessage(props.type)
})
</script>

<template>
<el-alert
    :title="message"
    type="error"
    :description="recoveryText"
    show-icon
    closable
/>
</template>
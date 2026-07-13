<script setup>

import RNAQualityTag from './RNAQualityTag.vue';
import PollutionTag from './PollutionTag.vue';
import TextCell from '../TextCell.vue';

const props = defineProps({
    sample: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['delete', 'ignore']);

</script>

<template>

<tr :class="{ ignored: sample.ignored }">
    <td class="template-id-cell">{{ sample.id || sample.templateId }}</td>
    <td>{{ sample.concentration ?? '-' }}</td>
    <td>{{ sample.a260280 ?? '-' }}</td>
    <td>{{ sample.a260230 ?? '-' }}</td>
    <td>
        <RNAQualityTag
            :quality="sample.result?.quality"
            :score="sample.result?.qualityScore"
        />
    </td>
    <td>
        <TextCell :text="sample.result?.pollution || ''" />
    </td>
    <td>
        <div class="short-text">
            <TextCell :text="sample.result?.suggestion || ''" />
        </div>
    </td>
    <td class="operation-cell">
        <el-button-group>
            <el-button
                type="text"
                size="small"
                @click="emit('ignore', sample)"
            >
                {{ sample.ignored ? '恢复' : '忽略' }}
            </el-button>
            <el-button
                type="danger"
                size="small"
                @click="emit('delete', sample)"
            >
                删除
            </el-button>
        </el-button-group>
    </td>
</tr>

</template>

<style scoped>

.template-id-cell{
    position: sticky;
    left: 0;
    z-index: 3;
    background: var(--card-bg, #ffffff);
}

.operation-cell{
    position: sticky;
    right: 0;
    z-index: 3;
    background: var(--card-bg, #ffffff);
}

.ignored{
    text-decoration: line-through;
    opacity: 0.55;
}

.short-text{
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 400px;
}

</style>

<script setup>

import { ref } from 'vue';
import RNAQualityTag from './RNAQualityTag.vue';
import TextCell from '../TextCell.vue';
import SampleAdviceDetail from '../SampleAdviceDetail.vue';
import { getQualityLabel } from '@/config/qualityLevel';
import { saveHistory } from '@/utils/historyManager';

const props = defineProps({
    samples: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['delete', 'ignore', 'cell-change']);

function rowClass({ row }) {
    if (row.ignored) {
        return 'ignored-row';
    }
    return 'normal-row';
}

function onCellChange(row) {
    saveHistory(props.samples);
    emit('cell-change', row);
}

function handleDelete(row) {
    const id = row.id;
    const el = document.querySelector(`tr[data-row-key="${id}"]`);
    
    if (el) {
        el.style.transition = 'all .3s';
        el.style.opacity = 0;
        el.style.transform = 'translateX(-30px)';
    }
    
    saveHistory(props.samples);
    
    setTimeout(() => {
        emit('delete', row);
    }, 300);
}

function handleIgnore(row) {
    saveHistory(props.samples);
    row.ignored = !row.ignored;
    emit('ignore', row);
}

function getTagType(value) {
    switch (value) {
        case 'excellent': return 'success';
        case 'good': return '';
        case 'warning': return 'warning';
        case 'poor': return 'danger';
        case 'fail': return 'danger';
        default: return 'info';
    }
}

</script>

<template>

<div class="table-wrapper">
    <div class="table-container">
        <el-table
            :data="samples"
            row-key="id"
            :row-class-name="rowClass"
            border
            height="600"
            stripe
            style="min-width: 1400px"
        >
            <el-table-column type="expand" width="50">
                <template #default="{ row }">
                    <SampleAdviceDetail :sample="row" />
                </template>
            </el-table-column>

            <el-table-column label="模板ID" prop="templateId" fixed="left" width="180">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.templateId"
                        size="small"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="RNA浓度" sortable prop="concentration" width="120">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.concentration"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="A260/A280" sortable prop="a260280" width="130">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.a260280"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="A260/A230" sortable prop="a260230" width="130">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.a260230"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="RNA质量" width="140">
                <template #default="scope">
                    <div class="quality-cell">
                        <el-tag
                            :type="getTagType(scope.row.result?.quality)"
                            size="small"
                        >
                            {{ getQualityLabel(scope.row.result?.quality) || '无法判断' }}
                        </el-tag>
                        <span
                            v-if="scope.row.result?.qualityScore !== null"
                            class="quality-score"
                        >
                            {{ scope.row.result.qualityScore }}分
                        </span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="污染分析" width="260">
                <template #default="scope">
                    <TextCell :text="scope.row.result?.pollution || ''" />
                </template>
            </el-table-column>

            <el-table-column label="建议" width="300">
                <template #default="scope">
                    <div class="short-text">
                        <TextCell :text="scope.row.result?.suggestion || ''" />
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="180">
                <template #default="scope">
                    <el-button-group>
                        <el-button
                            size="small"
                            @click="handleIgnore(scope.row)"
                        >
                            {{ scope.row.ignored ? '恢复' : '忽略' }}
                        </el-button>
                        <el-button
                            type="danger"
                            size="small"
                            @click="handleDelete(scope.row)"
                        >
                            删除
                        </el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>

</template>

<style scoped>

.table-wrapper{
    width: 100%;
    overflow-x: auto;
}

.table-wrapper .el-table{
    min-width: 1400px;
}

.table-container{
    width: 100%;
}

.cell-text{
    white-space: normal;
    word-break: break-word;
    line-height: 1.5;
}

.short-text{
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 400px;
}

.quality-cell{
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.quality-score{
    font-size: 11px;
    color: var(--text-secondary, #606266);
}

.el-table__body tr{
    transition: transform .35s ease, opacity .35s ease;
}

.table-row-move{
    transition: transform .35s ease;
}

:deep(.ignored-row td){
    position: relative;
    opacity: .45;
    animation: ignoreFade .4s;
}

:deep(.ignored-row td::after){
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    height: 1px;
    background: currentColor;
    width: 0;
    animation: lineThrough .5s forwards;
}

@keyframes lineThrough{
    from{ width: 0; }
    to{ width: 100%; }
}

@keyframes ignoreFade{
    from{ opacity: 1; }
    to{ opacity: .45; }
}

:deep(.normal-row td){
    position: relative;
}

:deep(.normal-row td::after){
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    height: 1px;
    background: currentColor;
    width: 0;
    animation: lineRemove .3s;
}

@keyframes lineRemove{
    from{ width: 100%; }
    to{ width: 0; }
}

</style>
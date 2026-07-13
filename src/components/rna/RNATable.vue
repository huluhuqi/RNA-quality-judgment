<script setup>

import { ref } from 'vue';
import RNAQualityTag from './RNAQualityTag.vue';
import TextCell from '../TextCell.vue';
import SampleAdviceDetail from '../SampleAdviceDetail.vue';
import { getQualityLabel } from '@/config/qualityLevel';
import { saveHistory } from '@/utils/historyManager';
import { isIgnored } from '@/utils/sampleFilter';
import { getTemplateVolumeDisplay, getWaterVolumeDisplay, getRTStatusCode, getRTSuggestion } from '@/utils/rtHelper';

const props = defineProps({
    samples: {
        type: Array,
        default: () => []
    },
    removingIds: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['delete', 'ignore', 'cell-change']);

function rowClass({ row }) {
    if (props.removingIds.includes(row.id)) {
        return 'removing-row';
    }
    if (isIgnored(row)) {
        return 'ignored-row';
    }
    return 'normal-row';
}

function onCellChange(row) {
    saveHistory(props.samples);
    emit('cell-change', row);
}

function handleDelete(row) {
    saveHistory(props.samples);
    emit('delete', row);
}

function handleIgnore(row) {
    saveHistory(props.samples);
    emit('ignore', row);
}

function getTagType(value) {
    switch (value) {
        case 'excellent': return 'success';
        case 'good': return '';
        case 'warning': return 'warning';
        case 'poor': return 'danger';
        case 'fail': return 'danger';
        case '合格': return 'success';
        case '需关注': return 'warning';
        case '不合格': return 'danger';
        case '待检测': return 'info';
        default: return 'info';
    }
}

function getRTTagType(statusCode) {
    switch (statusCode) {
        case 'OK': return 'success';
        case 'OVER_VOLUME': return 'danger';
        case 'NO_CONCENTRATION': return 'info';
        case 'LOW_INPUT': return 'warning';
        default: return 'info';
    }
}

function getRTStatusDisplay(statusCode) {
    switch (statusCode) {
        case 'OK': return '可直接RT';
        case 'OVER_VOLUME': return '需浓缩';
        case 'NO_CONCENTRATION': return '无法计算';
        case 'LOW_INPUT': return '投入不足';
        default: return '无法计算';
    }
}

function getTemplateVolume(sample) {
    return getTemplateVolumeDisplay(sample);
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
            style="min-width: 1600px"
        >
            <el-table-column type="expand" width="50">
                <template #default="{ row }">
                    <SampleAdviceDetail :sample="row" />
                </template>
            </el-table-column>

            <el-table-column label="模板ID" prop="templateId" fixed="left" width="180">
                <template #default="scope">
                    <el-input
                        v-model="scope.row.raw.templateId"
                        size="small"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="RNA浓度" sortable prop="concentration" width="120">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.raw.concentration"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="A260/A280" sortable prop="a260280" width="130">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.raw.a260280"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="A260/A230" sortable prop="a260230" width="130">
                <template #default="scope">
                    <el-input-number
                        v-model="scope.row.raw.a260230"
                        :controls="false"
                        @change="onCellChange(scope.row)"
                    />
                </template>
            </el-table-column>

            <el-table-column label="RNA质量" width="140">
                <template #default="scope">
                    <div class="quality-cell">
                        <el-tag
                            :type="getTagType(scope.row.analysis?.quality?.level || scope.row.result?.quality)"
                            size="small"
                        >
                            {{ getQualityLabel(scope.row.analysis?.quality?.level || scope.row.result?.quality) || '无法判断' }}
                        </el-tag>
                        <span
                            v-if="scope.row.analysis?.quality?.score !== null || scope.row.result?.qualityScore !== null"
                            class="quality-score"
                        >
                            {{ scope.row.analysis?.quality?.score || scope.row.result?.qualityScore }}分
                        </span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="污染分析" width="260">
                <template #default="scope">
                    <TextCell :text="scope.row.analysis?.pollution?.description || scope.row.result?.pollution || ''" />
                </template>
            </el-table-column>

            <el-table-column label="建议" width="300">
                <template #default="scope">
                    <div class="short-text">
                        <TextCell :text="scope.row.analysis?.advice?.experiment || scope.row.result?.suggestion || ''" />
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="模板建议体积" width="140">
                <template #default="scope">
                    <span
                        class="rt-volume"
                        :class="{ 'rt-warning': getRTStatusCode(scope.row) === 'OVER_VOLUME' }"
                    >{{ getTemplateVolume(scope.row) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="RT状态" width="120">
                <template #default="scope">
                    <el-tag
                        :type="getRTTagType(getRTStatusCode(scope.row))"
                        size="small"
                    >{{ getRTStatusDisplay(getRTStatusCode(scope.row)) }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="180">
                <template #default="scope">
                    <el-button-group>
                        <el-button
                            size="small"
                            @click="handleIgnore(scope.row)"
                        >
                            {{ isIgnored(scope.row) ? '恢复' : '忽略' }}
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
    min-width: 1600px;
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

.rt-cell{
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.rt-volume{
    font-size: 12px;
    color: var(--text-main, #303133);
}

.rt-warning{
    color: var(--danger-color, #f56c6c) !important;
    font-weight: 600;
}

.el-table__body tr{
    transition: transform .35s ease, opacity .35s ease;
}

:deep(.ignored-row td){
    position: relative;
    opacity: .45;
    animation: ignoreFade .4s ease;
}

:deep(.ignored-row td::after){
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    height: 1px;
    background: currentColor;
    width: 0;
    animation: lineThrough .5s ease forwards;
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

:deep(.removing-row td){
    animation: rowRemove .3s ease forwards;
}

@keyframes rowRemove{
    from{
        opacity: 1;
        transform: translateX(0);
    }
    to{
        opacity: 0;
        transform: translateX(30px);
    }
}

</style>
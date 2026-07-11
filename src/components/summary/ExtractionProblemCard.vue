<template>

<el-card shadow="hover" class="extraction-card">

<div class="card-title">
提取过程问题分析
</div>

<p class="summary-text">
{{ summaryText }}
</p>

<ExtractionProblemChart
ref="chartRef"
:data="chartData"
/>

<div
v-if="problemList.length"
class="problem-list"
>

<h4>
主要问题分布：
</h4>

<div
v-for="item in problemList"
:key="item.name"
class="problem-item"
>

<div class="problem-name">
{{ item.name }}
</div>

<div class="problem-count">
{{ item.value }} 个样本
</div>

</div>

</div>

<div
v-else
class="normal"
>
未发现明显提取流程异常
</div>

</el-card>

</template>

<script setup>

import { ref, computed, defineExpose } from 'vue'
import ExtractionProblemChart from '../ExtractionProblemChart.vue'
import { generateBatchExtractionSummary } from '../../core/advice/batchExtractionSummary'


const props = defineProps({
    summary: {
        type: Object,
        default: () => ({})
    }
})

const chartRef = ref(null)

const chartData = computed(() => {
    return props.summary.extractionChartData || []
})

const problemList = computed(() => {
    return chartData.value.slice(0, 6)
})

const summaryText = computed(() => {
    const badCount = (props.summary.qualityCount?.较差 || 0) +
                     (props.summary.qualityCount?.不合格 || 0);
    return generateBatchExtractionSummary(
        props.summary.extractionCount || {},
        props.summary.validCount || 0,
        badCount
    )
})

defineExpose({
    async getImage(){
        return chartRef.value?.getImage()
    }
})

</script>

<style scoped>

.card-title{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
}

.extraction-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f3f0ff
        );
    overflow: visible;
}

.summary-text{
    line-height: 1.8;
    margin-bottom: 20px;
}

.problem-list{
    max-height: 200px;
    overflow-y: auto;
    padding-right: 5px;
}

.problem-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
}

.problem-name{
    font-size: 13px;
    flex: 1;
    padding-right: 10px;
}

.problem-count{
    font-weight: 600;
    color: var(--primary-color, #409EFF);
    white-space: nowrap;
}

.normal{
    color: #67c23a;
}

</style>

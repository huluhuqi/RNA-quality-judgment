<template>

<div id="pdf-report" class="summary-container">

<!-- 第一层核心指标 -->

<el-row
:gutter="16"
class="top-summary pdf-section"
>

<el-col
:xs="24"
:sm="12"
:lg="6"
>
<OverviewCard :summary="summary" />
</el-col>

<el-col
:xs="24"
:sm="12"
:lg="6"
>
<QualityCard :summary="summary" />
</el-col>

<el-col
:xs="24"
:sm="12"
:lg="6"
>
<ApplicationCard :summary="summary" />
</el-col>

<el-col
:xs="24"
:sm="12"
:lg="6"
>
<RTRecommendCard :summary="summary" />
</el-col>

</el-row>

<!-- 分析图表 2x2 网格 -->

<div class="chart-grid pdf-section">

<QualityChartCard
ref="qualityChartRef"
:summary="summary"
/>

<PollutionCard
ref="pollutionChartRef"
:summary="summary"
/>

<ExtractionProblemCard
ref="extractionChartRef"
:summary="summary"
/>

<el-card shadow="hover" class="rt-detail-card">
<div class="card-title">RT 模板建议</div>
<div class="rt-content">
<div class="rt-item">
<span class="rt-label">推荐投入量</span>
<span class="rt-value">{{ summary.rt?.recommendedRNA || 0 }} ng</span>
</div>
<div class="rt-item">
<span class="rt-label">模板体积范围</span>
<span class="rt-value">{{ summary.rt?.minVolume || 0 }} ~ {{ summary.rt?.maxVolume || 0 }} μL</span>
</div>
<div class="rt-item">
<span class="rt-label">浓度状态</span>
<span class="rt-value">{{ summary.rt?.level || '无法判断' }}</span>
</div>
<p v-if="summary.rt?.message" class="rt-message">
{{ summary.rt.message }}
</p>
<p v-if="summary.rtWarning" class="rt-warning">
{{ summary.rtWarning }}
</p>
</div>
</el-card>

</div>

</div>

</template>

<script setup>

import {ref, defineExpose} from 'vue';

import OverviewCard from './summary/OverviewCard.vue';
import QualityCard from './summary/QualityCard.vue';
import ApplicationCard from './summary/ApplicationCard.vue';
import RTRecommendCard from './summary/RTRecommendCard.vue';
import QualityChartCard from './summary/QualityChartCard.vue';
import PollutionCard from './summary/PollutionCard.vue';
import ExtractionProblemCard from './summary/ExtractionProblemCard.vue';


const qualityChartRef = ref(null);
const pollutionChartRef = ref(null);
const extractionChartRef = ref(null);


defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});


defineExpose({
    async getCharts(){
        return {
            quality: await qualityChartRef.value?.getImage(),
            pollution: await pollutionChartRef.value?.getImage(),
            extraction: await extractionChartRef.value?.getImage()
        };
    }
});

</script>

<style scoped>

.summary-container{
    width: 100%;
}

.chart-grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
}

@media (max-width: 900px){
    .chart-grid{
        grid-template-columns: 1fr;
    }
}

/* PDF分页：避免模块被截断 */
.pdf-section{
    page-break-inside: avoid;
    margin-bottom: 20px;
}

.card-title{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
}

.rt-detail-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f0f9ff
        );
    overflow: visible;
}

.rt-content{
    padding: 0;
}

.rt-item{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
}

.rt-label{
    color: var(--text-light, #606266);
}

.rt-value{
    font-weight: 600;
    color: var(--primary-color, #409EFF);
}

.rt-message{
    margin-top: 12px;
    padding: 10px;
    background: var(--card-color, #ffffff);
    border-radius: 4px;
    line-height: 1.6;
    font-size: 13px;
}

.rt-warning{
    margin-top: 10px;
    padding: 10px;
    background: rgba(245, 108, 108, 0.1);
    color: var(--danger-color);
    border-radius: 4px;
    line-height: 1.6;
    font-size: 13px;
}

/* 打印优化 */
@media print{
    .summary-container{
        background: #ffffff !important;
    }
    .pdf-section{
        break-inside: avoid;
    }
}

</style>

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

<!-- 质量分布 -->

<el-row
:gutter="16"
class="chart-row pdf-section"
>

<el-col
:xs="24"
>
<QualityChartCard
ref="qualityChartRef"
:summary="summary"
/>
</el-col>

</el-row>

<!-- 污染分析 -->

<el-row
:gutter="16"
class="chart-row pdf-section"
>

<el-col
:xs="24"
>
<PollutionCard
ref="pollutionChartRef"
:summary="summary"
/>
</el-col>

</el-row>

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


const qualityChartRef = ref(null);
const pollutionChartRef = ref(null);


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
            pollution: await pollutionChartRef.value?.getImage()
        };
    }
});

</script>

<style scoped>

.summary-container{
    width:100%;
}

.chart-row{
    margin-top:16px;
}

/* PDF分页：避免模块被截断 */
.pdf-section{
    page-break-inside:avoid;
    margin-bottom:20px;
}

/* 打印优化 */
@media print{
    .summary-container{
        background:#ffffff !important;
    }
    .pdf-section{
        break-inside:avoid;
    }
}

</style>

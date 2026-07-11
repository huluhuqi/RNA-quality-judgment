<template>

<el-card shadow="hover" class="pollution-card">

<div class="card-title">
污染分析
</div>

<p class="analysis-text">
{{summary.pollution || '暂无数据'}}
</p>

<PollutionChart
ref="chartRef"
:data="summary.pollutionCount"
/>

<div
v-if="summary.pollutionSamples?.length"
class="abnormal-list"
>

<h4>
异常样本：
</h4>

<div
v-for="item in summary.pollutionSamples"
:key="item.id"
class="sample-item"
>

<b>
{{item.id}}
</b>
：
{{item.pollution}}

</div>

</div>

<div
v-else
class="normal"
>
未发现明显污染风险
</div>

</el-card>

</template>

<script setup>

import {ref, defineExpose} from 'vue';
import PollutionChart from '../PollutionChart.vue';

defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});

const chartRef = ref(null);

defineExpose({
    async getImage(){
        return chartRef.value?.getImage();
    }
});

</script>

<style scoped>

.card-title{
    font-size:16px;
    font-weight:600;
    margin-bottom:15px;
}

.pollution-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fff7f3
        );
    overflow:visible;
}

.analysis-text{
    line-height:1.8;
    margin-bottom:20px;
}

.abnormal-list{
    max-height:260px;
    overflow-y:auto;
    padding-right:5px;
}

.sample-item{
    padding:8px 0;
    border-bottom:1px solid #eee;
}

.normal{
    color:#67c23a;
}

</style>

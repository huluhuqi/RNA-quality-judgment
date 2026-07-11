<template>

<div id="pdf-report" class="summary-container">


<!-- PDF封面标题 -->

<div class="pdf-title">

<h1>
RNA质量检测实验报告
</h1>

<p>
RNA Quality Judgment
</p>

</div>


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

<el-card shadow="hover" class="info-card">

<div class="card-title">
实验概况
</div>

<div class="info">

<p>
总样本：
<b>{{summary.totalCount || 0}}</b>
</p>

<p>
有效样本：
<b>{{summary.validCount || 0}}</b>
</p>

<p>
忽略样本：
<b>{{summary.ignoredCount || 0}}</b>
</p>

<p>
平均浓度：
<b>{{summary.avgConcentration || 0}} ng/μL</b>
</p>

</div>

</el-card>

</el-col>



<el-col
:xs="24"
:sm="12"
:lg="6"
>

<el-card shadow="hover" class="quality-card">

<div class="card-title">
RNA质量评级
</div>

<div class="info">

<p>
总体质量：

<el-tag
:type="qualityTag"
>
{{summary.quality || '待检测'}}
</el-tag>

</p>

<p>
优秀：
{{getQC('优秀')}} 个
</p>

<p>
良好：
{{getQC('良好')}} 个
</p>

<p>
较差：
{{getQC('较差')}} 个
</p>

</div>

</el-card>

</el-col>




<el-col
:xs="24"
:sm="12"
:lg="6"
>

<el-card shadow="hover" class="application-card">

<div class="card-title">
实验用途分析
</div>

<div class="info">

<p>
当前用途：

<el-tag
:type="applicationType"
size="small"
>
{{summary.applicationSummary?.name || '未选择'}}
</el-tag>

</p>

<p>
符合要求：

<b>
{{summary.applicationSummary?.goodCount || 0}}
</b>
个
</p>

<p class="warning">
需关注：
{{summary.applicationSummary?.warningCount || 0}}
个
</p>

</div>

</el-card>

</el-col>





<el-col
:xs="24"
:sm="12"
:lg="6"
>

<el-card shadow="hover" class="rt-card">

<div class="card-title">
RT模板建议
</div>

<div class="info">

<p>
推荐RNA量：
<b>
{{summary.rt?.recommendedRNA || 0}}
</b>
ng
</p>

<p>
模板体积：
<b>
{{summary.rt?.minVolume || 0}} ~ {{summary.rt?.maxVolume || 0}}
</b>
μL
</p>

<p>
状态：
<el-tag
:type="rtLevelType"
size="small"
>
{{summary.rt?.level || '无法判断'}}
</el-tag>
</p>

<p
v-if="summary.rtWarning"
class="rt-warning"
>
<el-alert

type="warning"

:title="'浓度差异警告'"

:description="summary.rtWarning"

show-icon

:closable="false"

/>
</p>

</div>

</el-card>

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

<el-card shadow="hover" class="chart-card">

<div class="card-title">
RNA质量分布
</div>

<QualityChart
ref="qualityChartRef"
:data="summary.qualityCount"
/>

</el-card>

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

<el-card shadow="hover" class="pollution-card">

<div class="card-title">
污染分析
</div>

<p class="analysis-text">
{{summary.pollution || '暂无数据'}}
</p>

<PollutionChart
ref="pollutionChartRef"
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

</el-col>

</el-row>


</div>

</template>




<script setup>

import {computed, ref, defineExpose} from 'vue'

import QualityChart from './QualityChart.vue'
import PollutionChart from './PollutionChart.vue'


const qualityChartRef = ref(null)

const pollutionChartRef = ref(null)


const props =
defineProps({

summary:{
type:Object,
default:()=>({})
}

})


function getQC(type){
    return (
        props.summary
        .qualityCount
        ?.[type]
        || 0
    )
}


const qualityTag =
computed(()=>{

switch(
props.summary.quality
){

case '优秀':
return 'success'

case '良好':
return ''

case '一般':
return 'warning'

case '较差':
return 'danger'

default:
return 'info'

}

})


const applicationType =
computed(()=>{

const level =
props.summary
.applicationSummary
?.qualityLevel

if(level === '严格'){
    return 'danger'
}

return 'success'

})


const rtLevelType =
computed(()=>{

const level =
props.summary
.rt
?.level

switch(level){

case '浓度充足':
return 'success'

case '浓度一般':
return ''

case '浓度偏低':
return 'warning'

case '浓度不足':
return 'danger'

default:
return 'info'

}

})


defineExpose({

async getCharts(){

return {

quality:
await qualityChartRef.value?.getImage(),

pollution:
await pollutionChartRef.value?.getImage()

}

}

})


</script>




<style scoped>

.summary-container{
    width:100%;
}

.chart-row{
    margin-top:16px;
}

.card-title{
    font-size:16px;
    font-weight:600;
    margin-bottom:15px;
}

.info p{
    margin:8px 0;
    font-size:14px;
    line-height:1.6;
}

.info-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f3f8ff
        );
}

.quality-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f3fff7
        );
}

.application-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f0f0ff
        );
}

.rt-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #fff7d6
        );
}

.chart-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f7fffc
        );
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

.warning{
    color:#e6a23c;
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


/* PDF封面标题 */
.pdf-title{
    text-align:center;
    padding:30px;
    margin-bottom:20px;
    background:
        linear-gradient(
            135deg,
            #f0f7ff,
            #ffffff
        );
    border-radius:8px;
}

.pdf-title h1{
    font-size:28px;
    font-weight:bold;
    color:#303133;
    margin-bottom:8px;
}

.pdf-title p{
    font-size:14px;
    color:#909399;
    letter-spacing:1px;
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

<template>


<el-card>


<template #header>

<span>
本次实验总体分析
</span>

</template>


<el-row :gutter="15">


<el-col :span="8">

<el-card class="inner-card" shadow="never">

<template #header>

<span class="card-title">实验概况</span>

</template>

<div class="stat-item">

<span class="label">样本总数：</span>

<span class="value">{{summary.totalCount}}</span>

</div>

<div class="stat-item">

<span class="label">有效样本：</span>

<span class="value">{{summary.validCount}}</span>

</div>

<div class="stat-item">

<span class="label">忽略样本：</span>

<span class="value">{{summary.ignoredCount}}</span>

</div>

<div class="divider"></div>

<div class="stat-item">

<span class="label">浓度范围：</span>

<span class="value">

{{summary.minConcentration.toFixed(2)}}

-

{{summary.maxConcentration.toFixed(2)}}

ng/μL

</span>

</div>

<div class="stat-item">

<span class="label">平均浓度：</span>

<span class="value">

{{summary.avgConcentration.toFixed(2)}}

ng/μL

</span>

</div>

<div class="divider"></div>

<div class="stat-item">

<span class="label">平均A260/A280：</span>

<span class="value">{{summary.avgA260280.toFixed(2)}}</span>

</div>

<div class="stat-item">

<span class="label">平均A260/A230：</span>

<span class="value">

{{summary.avgA260230 ?
summary.avgA260230.toFixed(2)
:
'无数据'}}

</span>

</div>

</el-card>

</el-col>


<el-col :span="8">

<el-card class="inner-card" shadow="never">

<template #header>

<span class="card-title">RNA质量</span>

</template>

<div class="quality-overall">

<span class="label">总体：</span>

<el-tag

:type="getQualityTagType(summary.quality)"

size="large"

>

{{summary.quality}}

</el-tag>

</div>

<div class="divider"></div>

<div class="quality-detail">

<div class="quality-item">

<el-tag type="success">优秀</el-tag>

<span class="q-count">{{summary.qualityDetail['优秀'] || 0}}</span>

</div>

<div class="quality-item">

<el-tag>良好</el-tag>

<span class="q-count">{{summary.qualityDetail['良好'] || 0}}</span>

</div>

<div class="quality-item">

<el-tag type="warning">一般</el-tag>

<span class="q-count">{{summary.qualityDetail['一般'] || 0}}</span>

</div>

<div class="quality-item">

<el-tag type="danger">较差</el-tag>

<span class="q-count">{{summary.qualityDetail['较差'] || 0}}</span>

</div>

</div>

</el-card>

</el-col>


<el-col :span="8">

<el-card class="inner-card" shadow="never">

<template #header>

<span class="card-title">污染分析</span>

</template>

<div class="pollution-summary">

{{summary.pollutionSummary}}

</div>

<div v-if="summary.pollutionSamples && summary.pollutionSamples.length > 0" class="divider"></div>

<div
v-if="summary.pollutionSamples && summary.pollutionSamples.length > 0"
class="pollution-list"
>

<div
v-for="(item, index) in summary.pollutionSamples.slice(0, 5)"
:key="index"
class="pollution-item"
>

<div class="pollution-id">

<el-tag type="warning" size="small">

{{item.id}}

</el-tag>

</div>

<div class="pollution-detail">

<span v-if="item.a260230">A260/A230={{item.a260230}}</span>

<span v-if="item.a260280 && item.a260230"> / </span>

<span v-if="item.a260280 < 1.8">A260/A280={{item.a260280}}</span>

</div>

<div class="pollution-reason">{{item.reason}}</div>

</div>

<div
v-if="summary.pollutionSamples.length > 5"
class="pollution-more"
>

还有 {{summary.pollutionSamples.length - 5}} 个样本...

</div>

</div>

</el-card>

</el-col>


</el-row>


<div class="rt-section">

<el-card class="inner-card" shadow="never">

<template #header>

<span class="card-title">反转录推荐方案</span>

</template>

<el-row :gutter="20">

<el-col :span="6">

<div class="rt-item">

<span class="label">推荐RNA投入：</span>

<span class="value">{{summary.rt.recommendedRNA}} ng</span>

</div>

</el-col>

<el-col :span="6">

<div class="rt-item">

<span class="label">模板体积范围：</span>

<span class="value">{{summary.rt.minVolume}} - {{summary.rt.maxVolume}} μL</span>

</div>

</el-col>

<el-col :span="12">

<div class="rt-item">

<span class="label">RT建议：</span>

<span class="value">{{summary.rt.suggestion}}</span>

</div>

</el-col>

</el-row>

</el-card>

</div>


</el-card>


</template>


<script setup>


defineProps({

summary:{

type:Object,

required:true

}

})


function getQualityTagType(value){

switch(value){

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

}


</script>


<style scoped>


.inner-card{

margin-bottom:15px;

}


.card-title{

font-weight:bold;

font-size:15px;

}


.stat-item{

line-height:2;

font-size:14px;

}


.label{

color:#666;

}


.value{

font-weight:bold;

}


.divider{

height:1px;

background:#eee;

margin:10px 0;

}


.quality-overall{

text-align:center;

padding:10px 0;

}


.quality-overall .label{

margin-right:10px;

font-size:16px;

}


.quality-detail{

display:flex;

flex-direction:column;

gap:10px;

}


.quality-item{

display:flex;

justify-content:space-between;

align-items:center;

padding:4px 8px;

background:#fafafa;

border-radius:4px;

}


.q-count{

font-weight:bold;

font-size:16px;

}


.pollution-summary{

line-height:1.8;

color:#333;

font-size:14px;

}


.pollution-list{

max-height:240px;

overflow-y:auto;

}


.pollution-item{

margin-bottom:8px;

padding:8px;

background:#fdf6ec;

border-radius:4px;

border-left:3px solid #e6a23c;

}


.pollution-id{

margin-bottom:4px;

}


.pollution-detail{

font-size:12px;

color:#906700;

margin-bottom:4px;

}


.pollution-reason{

font-size:13px;

color:#604000;

}


.pollution-more{

text-align:center;

color:#999;

font-size:13px;

padding-top:5px;

}


.rt-section{

margin-top:5px;

}


.rt-item{

line-height:2;

font-size:14px;

}


</style>

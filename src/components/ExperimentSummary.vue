<template>

<el-card class="summary-card gradient-summary">


<template #header>

<div class="title">

本次实验总体分析

</div>

</template>



<el-row :gutter="15">


<el-col :xs="24" :sm="8">


<el-card shadow="hover" class="info-card">


<template #header>

实验概况

</template>



<div class="item">

总样本：

<b>
{{summary.totalCount || 0}}
</b>

</div>




<div class="item">

有效分析：

<b>
{{summary.validCount || 0}}
</b>

</div>




<div class="item">

忽略样本：

<b>
{{summary.ignoredCount || 0}}
</b>

</div>




<div class="item">

待检测：

<b>
{{summary.pendingCount || 0}}
</b>

</div>





<div class="item">

平均RNA浓度：

<b>

{{summary.avgConcentration || 0}}

ng/μL

</b>


</div>





<div class="item">

浓度范围：

<b>

{{summary.minConcentration || 0}}

~

{{summary.maxConcentration || 0}}

ng/μL

</b>


</div>



</el-card>


</el-col>





<el-col :xs="24" :sm="8">


<el-card shadow="hover" class="quality-card">


<template #header>

RNA质量分布

</template>



<div class="quality-title">


总体质量：

<el-tag

:type="qualityType"

>

{{summary.quality || '暂无数据'}}

</el-tag>

</div>

<QualityChart :data="summary.qualityCount" />

<div class="quality-list">


<div>

优秀：

{{getQualityCount('优秀')}}

个

</div>


<div>

良好：

{{getQualityCount('良好')}}

个

</div>



<div>

一般：

{{getQualityCount('一般')}}

个

</div>




<div>

较差：

{{getQualityCount('较差')}}

个

</div>



<div>

待检测：

{{getQualityCount('待检测')}}

个

</div>



</div>


</el-card>


</el-col>





<el-col :xs="24" :sm="8">


<el-card shadow="hover" class="pollution-card">


<template #header>

污染分析

</template>



<div class="pollution-summary">


{{summary.pollution || '暂无数据'}}


</div>

<PollutionChart :data="summary.pollutionCount" />

<div

v-if="summary.pollutionSamples?.length"

class="pollution-list"

>


<div>

<b>
异常样本：
</b>

</div>



<div

v-for="item in summary.pollutionSamples"

:key="item.id"

class="pollution-item"

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




<el-card

v-if="summary.rt"

shadow="hover"

class="rt-card rt-gradient"

>


<template #header>

反转录RNA模板推荐

</template>




<div>


推荐RNA投入：

<b>

{{summary.rt.recommendedRNA || 0}}

ng

</b>


</div>




<div>


模板体积范围：

<b>

{{summary.rt.minVolume || 0}}

~

{{summary.rt.maxVolume || 0}}

μL

</b>


</div>



<div>


建议：

{{summary.rt.suggestion || ''}}

</div>



</el-card>



</el-card>


</template>





<script setup>


import {computed} from 'vue'

import QualityChart from './QualityChart.vue'
import PollutionChart from './PollutionChart.vue'



const props =
defineProps({

summary:{

type:Object,

required:true

}

})





function getQualityCount(type){


return (

props.summary

.qualityCount

?.[type]

||0

)


}





const qualityType = computed(()=>{


switch(

props.summary.quality

){


case '优秀':

return 'success'


case '一般':

return 'warning'


case '较差':

return 'danger'


default:

return ''

}



})




</script>





<style scoped>


.summary-card{

width:100%;

}

.gradient-summary{

background:

linear-gradient(

135deg,

#f5faff,

#eef7ff

);

border-radius:

14px;

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

.pollution-card{

background:

linear-gradient(

135deg,

#ffffff,

#fff7f3

);

}

.title{

font-size:18px;

font-weight:bold;

}





.item{

line-height:28px;

}





.quality-title{

margin-bottom:15px;

}





.quality-list{

line-height:30px;

}





.pollution-summary{

line-height:22px;

margin-bottom:15px;

}





.pollution-item{

margin-top:8px;

line-height:22px;

}





.normal{

color:#67c23a;

}





.rt-card{

margin-top:15px;

line-height:28px;

}

.rt-gradient{

background:

linear-gradient(

135deg,

#fffdf0,

#fff7d6

);

}




</style>

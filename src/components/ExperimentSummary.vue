<template>


<el-card>


<template #header>

<span>
本次实验总体分析
</span>

</template>




<div class="summary">


<p>
样本数量：

<b>
{{summary.count}}
</b>

</p>



<p>

RNA浓度：

<b>

平均
{{summary.avgConcentration.toFixed(2)}}

ng/μL

</b>

</p>



<p>

浓度范围：

<b>

{{summary.minConcentration.toFixed(2)}}

-

{{summary.maxConcentration.toFixed(2)}}

ng/μL

</b>

</p>




<p>

平均A260/A280：

<b>

{{summary.avgA260280.toFixed(2)}}

</b>

</p>




<p>

平均A260/A230：

<b>

{{summary.avgA260230 ?
summary.avgA260230.toFixed(2)
:
'无数据'}}

</b>

</p>




<p>

总体RNA质量：

<b>

{{summary.quality}}

</b>

</p>




<p>

污染分析：

<b>

{{summary.pollution}}

</b>

</p>


<p>

推荐反转录RNA投入：

<b>

{{summary.rt.recommendedRNA}}

ng

</b>

</p>



<p>

模板体积范围：

<b>

{{summary.rt.minVolume}}

-

{{summary.rt.maxVolume}}

μL

</b>

</p>



<p>

RT建议：

<b>

{{summary.rt.suggestion}}

</b>

</p>




<p>

异常样本：

<b>

{{summary.abnormal}}

个

</b>

</p>



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


</script>




<style scoped>


.summary{

line-height:2;

}


b{

font-weight:bold;

}



</style>

<template>

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

<p
v-if="summary.noConcentrationCount > 0"
class="warn-text"
>
缺少浓度：
<b>{{summary.noConcentrationCount}}</b> 个（无法推荐RT模板量）
</p>

<p
v-if="summary.noA260280Count > 0"
class="warn-text"
>
缺少A260/280：
<b>{{summary.noA260280Count}}</b> 个（仅完成RT分析）
</p>

<p
v-if="summary.partialPollutionCount > 0"
class="warn-text"
>
缺少A260/230：
<b>{{summary.partialPollutionCount}}</b> 个（仅依据A260/280判断污染）
</p>

</div>

</el-card>

</template>

<script setup>

defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});

</script>

<style scoped>

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

.warn-text{
    color:var(--warning-color, #e6a23c);
    font-size:13px;
}

.info-card{
    background:
        linear-gradient(
            135deg,
            var(--card-overview-from),
            var(--card-overview-to)
        );
}

</style>

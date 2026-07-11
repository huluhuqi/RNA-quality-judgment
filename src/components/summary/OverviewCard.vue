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

.info-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f3f8ff
        );
}

</style>

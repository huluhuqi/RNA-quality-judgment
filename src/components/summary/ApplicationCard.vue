<template>

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

</template>

<script setup>

import {computed} from 'vue';

const props = defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});

const applicationType = computed(()=>{
    const level =
        props.summary
        .applicationSummary
        ?.qualityLevel;

    if(level === '严格'){
        return 'danger';
    }
    return 'success';
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

.application-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f0f0ff
        );
}

.warning{
    color:#e6a23c;
}

</style>

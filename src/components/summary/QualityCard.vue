<template>

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

</template>

<script setup>

import {computed} from 'vue';

const props = defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});

function getQC(type){
    return (
        props.summary
        .qualityCount
        ?.[type]
        || 0
    );
}

const qualityTag = computed(()=>{
    switch(props.summary.quality){
        case '优秀': return 'success';
        case '良好': return '';
        case '一般': return 'warning';
        case '较差': return 'danger';
        default: return 'info';
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

.quality-card{
    background:
        linear-gradient(
            135deg,
            #ffffff,
            #f3fff7
        );
}

</style>

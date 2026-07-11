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
{{getQualityLabel(summary.quality) || '待检测'}}
</el-tag>

</p>

<p>
优秀：
{{getQC(QUALITY_LEVEL.EXCELLENT.value)}} 个
</p>

<p>
良好：
{{getQC(QUALITY_LEVEL.GOOD.value)}} 个
</p>

<p>
较差：
{{getQC(QUALITY_LEVEL.POOR.value) + getQC(QUALITY_LEVEL.FAIL.value)}} 个
</p>

</div>

</el-card>

</template>

<script setup>

import {computed} from 'vue';
import { QUALITY_LEVEL, getQualityLabel } from '../../config/qualityLevel';

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
        case QUALITY_LEVEL.EXCELLENT.value: return 'success';
        case QUALITY_LEVEL.GOOD.value: return '';
        case QUALITY_LEVEL.WARNING.value: return 'warning';
        case QUALITY_LEVEL.POOR.value: return 'danger';
        case QUALITY_LEVEL.FAIL.value: return 'danger';
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
            var(--card-quality-from),
            var(--card-quality-to)
        );
}

</style>

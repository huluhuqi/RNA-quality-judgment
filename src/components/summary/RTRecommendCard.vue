<template>

<el-card shadow="hover" class="rt-card">

<div class="card-title">
RT体系配置
</div>

<div class="info">

<p>
RNA投入量：
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
最大模板体积：
<b>
12
</b>
μL
</p>

<p>
状态：
<el-tag
:type="rtLevelType"
size="small"
effect="light"
>
{{rtLevelText}}
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

</template>

<script setup>

import {computed} from 'vue';

const props = defineProps({
    summary:{
        type:Object,
        default:()=>({})
    }
});

const rtLevelType = computed(()=>{
    const level =
        props.summary
        .rt
        ?.level;

    switch(level){
        case '浓度充足': return 'success';
        case '浓度一般': return '';
        case '浓度偏低': return 'warning';
        case '浓度不足': return 'danger';
        default: return 'info';
    }
});

const rtLevelText = computed(()=>{
    const level = props.summary?.rt?.level;
    return level || '无法判断';
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

.rt-card{
    background:
        linear-gradient(
            135deg,
            var(--card-rt-from),
            var(--card-rt-to)
        );
}

</style>

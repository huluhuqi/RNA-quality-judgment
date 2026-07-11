<template>

<el-card class="parameter-card">

<template #header>

<span>
提取及RT参数
</span>

</template>


<div class="parameter-grid">

<div class="parameter-item">

<el-form-item label="RNA提取方法">

<el-select

v-model="config.method"

class="full-select"

>

<el-option

v-for="item in methods"

:key="item"

:label="item"

:value="item"

/>

</el-select>

</el-form-item>

</div>


<div class="parameter-item">

<el-form-item label="下游实验用途">

<el-select

v-model="config.application"

class="full-select"

>

<el-option

v-for="item in applications"

:key="item.key"

:label="item.name"

:value="item.key"

/>

</el-select>

</el-form-item>

</div>


<div class="parameter-item">

<el-form-item label="最大RNA上样量">

<div class="input-with-unit">

<el-input-number

v-model="config.maxRNA"

:min="1"

class="compact-input"

/>

<span class="unit">
ng
</span>

</div>

</el-form-item>

</div>


<div class="parameter-item">

<el-form-item label="最小RNA上样量">

<div class="input-with-unit">

<el-input-number

v-model="config.minRNA"

:min="1"

class="compact-input"

/>

<span class="unit">
ng
</span>

</div>

</el-form-item>

</div>


<div class="parameter-item">

<el-form-item label="最大模板体积">

<div class="input-with-unit">

<el-input-number

v-model="config.maxVolume"

:min="1"

class="compact-input"

/>

<span class="unit">
μL
</span>

</div>

</el-form-item>

</div>


</div>


</el-card>

</template>


<script setup>

import { reactive, watch } from 'vue'

import { extractionMethods } from '../config/extractionAdvice'

import { downstreamApplications } from '../config/downstreamApplication'

const methods = extractionMethods

const applications = Object.entries(downstreamApplications).map(([key, value]) => ({
    key,
    name: value.name
}))

const config = reactive({

method:'硅胶膜柱提法',

application:'qPCR',

maxRNA:1000,

minRNA:10,

maxVolume:12

})

const emit = defineEmits([
    'update-config'
])


watch(

config,

(value)=>{

emit(

'update-config',

value

)

},

{
deep:true
}

)

</script>


<style scoped>

.parameter-card{
    width:100%;
    background:
        linear-gradient(
            135deg,
            var(--card-rt-from),
            var(--card-rt-to)
        );
    border-radius:14px;
}

.parameter-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}

.parameter-item{
    width:100%;
}

.full-select{
    width:100%;
}

.input-with-unit{
    display:flex;
    align-items:center;
    gap:8px;
}

.compact-input{
    width:67%;
}

.unit{
    color:var(--text-secondary);
    font-size:14px;
    white-space:nowrap;
}

@media(max-width:900px){
    .parameter-grid{
        grid-template-columns:repeat(2,1fr);
    }
}

@media(max-width:600px){
    .parameter-grid{
        grid-template-columns:1fr;
    }
}

</style>

<template>


<div class="app-container">


<Header/>


<RTParameter

@update-config="updateRTConfig"

/>



<ExperimentControl

@new="newExperiment"

@clear="clearAll"

/>



<ExperimentSummary

ref="summaryRef"

:summary="summary"

/>



<div class="space"></div>



<RNADataTable
ref="rnaTableRef"
@update-data="updateData"
/>



<div class="space"></div>


<ExportPanel

:summary="summary"

:data="samples"

:settings="rtConfig"

:summaryRef="summaryRef"

/>



</div>


</template>



<script setup>

import './assets/style.css'
import './assets/theme.css'

import {
initTheme
}
from './theme/theme'

initTheme()

import {ref} from 'vue'


import {

watch,

onMounted

} from 'vue'


import Header from './components/Header.vue'

import RTParameter from './components/RTParameter.vue'

import ExperimentSummary from './components/ExperimentSummary.vue'

import RNADataTable from './components/RNADataTable.vue'


import ExportPanel
from './components/ExportPanel.vue'


import ExperimentControl

from './components/ExperimentControl.vue'





import {calculateBatch}

from './core/BatchStatistics'


import {analyzeSamples}

from './core/analyzer/sampleAnalyzer'


import {
    calculateRT,
    checkConcentrationDistribution
}

from './core/RTRecommendation'


import {

saveExperiment,

loadExperiment,

clearExperiment

}

from './utils/storage'





const summary = ref({

totalCount:0,

validCount:0,

ignoredCount:0,

pendingCount:0,

avgConcentration:0,

minConcentration:0,

maxConcentration:0,

quality:'暂无数据',

qualityCount:{

'优秀':0,

'良好':0,

'一般':0,

'较差':0,

'待检测':0

},

pollution:'暂无数据',

pollutionSamples:[],

rt:{

recommendedRNA:0,

minVolume:0,

maxVolume:0,

suggestion:''

}

})


const samples =
ref([])


const rnaTableRef = ref(null)

const summaryRef = ref(null)



const rtConfig = ref({

method:'硅胶膜柱提法',

maxRNA:1000,

minRNA:10,

maxVolume:12

})





function updateData(data){


samples.value=data

// 统一分析：只执行一次，结果写入 sample.result
refreshAnalysis()


}


/**
 * 统一刷新分析结果与统计
 * RNA 质量分析只执行一次，所有模块读取 sample.result
 */
function refreshAnalysis(){


const data = samples.value

// 一次批量分析，结果写入 result 字段
const analyzed = analyzeSamples(data, rtConfig.value)

// 原地更新 result，保持数组引用与表格响应式
data.forEach((item, i)=>{
    item.result = analyzed[i].result
})

const batch =
calculateBatch(data, rtConfig.value.method, rtConfig.value.application)

const validSamples =
data.filter(s=>!s.ignored)

batch.rt =
calculateRT(
validSamples,
rtConfig.value
)

batch.rtWarning =
checkConcentrationDistribution(
validSamples
)

summary.value=batch


}


function updateRTConfig(config){


rtConfig.value=config

// 参数变更时重新分析
refreshAnalysis()


}


function newExperiment(){


samples.value=[]


summary.value={

totalCount:0,

validCount:0,

ignoredCount:0,

pendingCount:0,

quality:"暂无数据",

qualityCount:{

'优秀':0,

'良好':0,

'一般':0,

'较差':0,

'待检测':0

}

}

}


function clearAll(){


samples.value=[]


clearExperiment()


updateData([])


}



watch(

samples,

(value)=>{


saveExperiment({

samples:value,

rtConfig:rtConfig.value

})


},

{

deep:true

}

)


onMounted(()=>{


const saved =
loadExperiment()



if(saved){


samples.value =
saved.samples || []



rtConfig.value =
saved.rtConfig || {


maxRNA:1000,

minRNA:10,

maxVolume:12

}


updateData(
samples.value
)


}


})




</script>



<style scoped>


.app-container{

min-height:100vh;

background:

var(--bg-color);

padding:

20px;

transition:

all .3s;

width:90%;

max-width:1600px;

margin:0 auto;

}

@media (max-width:768px){
    .app-container{
        padding:10px;
        width:100%;
    }
}


.space{

height:20px;

}


</style>

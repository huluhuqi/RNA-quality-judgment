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


import {calculateRT}

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



const rtConfig = ref({

method:'硅胶膜柱提法',

maxRNA:1000,

minRNA:10,

maxVolume:12

})





function updateData(data){


samples.value=data


const batch =
calculateBatch(data, rtConfig.value.method, rtConfig.value.application)


const validSamples =
data.filter(s=>!s.ignored)


batch.rt =
calculateRT(
validSamples,
rtConfig.value
)


summary.value=batch


}




function updateRTConfig(config){


rtConfig.value=config


const validSamples =
samples.value.filter(s=>!s.ignored)


const batch =
calculateBatch(samples.value, config.method, config.application)


batch.rt =
calculateRT(
validSamples,
config
)


summary.value=batch


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

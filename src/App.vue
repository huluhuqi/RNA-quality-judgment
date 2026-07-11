<template>


<div class="app">


<Header/>


<RTParameter

@update-config="updateRTConfig"

/>



<ExperimentSummary
:summary="summary"
/>



<div class="space"></div>



<RNADataTable
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


import {ref} from 'vue'


import Header from './components/Header.vue'

import RTParameter from './components/RTParameter.vue'

import ExperimentSummary from './components/ExperimentSummary.vue'

import RNADataTable from './components/RNADataTable.vue'


import ExportPanel
from './components/ExportPanel.vue'


import {calculateBatch}

from './core/BatchStatistics'


import {calculateRT}

from './core/RTRecommendation'





const summary = ref({

count:0,

avgConcentration:0,

minConcentration:0,

maxConcentration:0,

avgA260280:0,

avgA260230:0,

quality:'暂无数据',

pollution:'暂无数据',

abnormal:0,

rt:{

recommendedRNA:0,

minVolume:0,

maxVolume:0,

suggestion:''

}

})


const samples =
ref([])



const rtConfig = ref({

maxRNA:1000,

minRNA:10,

maxVolume:12

})





function updateData(data){


samples.value=data


const batch =
calculateBatch(data)



batch.rt =
calculateRT(
data,
rtConfig.value
)



summary.value=batch


}





function updateRTConfig(config){


rtConfig.value=config



summary.value.rt =
calculateRT(
samples.value,
rtConfig.value
)


}




</script>



<style scoped>


.app{

width:90%;

max-width:1600px;

margin:30px auto;


}


.space{

height:20px;

}


</style>

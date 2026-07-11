<template>


<div class="app">


<Header/>


<RTParameter/>



<ExperimentSummary
:summary="summary"
/>



<div class="space"></div>



<RNADataTable
@update-data="updateData"
/>



</div>


</template>



<script setup>


import {ref} from 'vue'


import Header from './components/Header.vue'

import RTParameter from './components/RTParameter.vue'

import ExperimentSummary from './components/ExperimentSummary.vue'

import RNADataTable from './components/RNADataTable.vue'


import {calculateBatch}

from './core/BatchStatistics'





const summary = ref({

count:0,

avgConcentration:0,

minConcentration:0,

maxConcentration:0,

avgA260280:0,

avgA260230:0,

quality:'暂无数据',

pollution:'暂无数据',

abnormal:0

})






function updateData(data){


summary.value =
calculateBatch(data)


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

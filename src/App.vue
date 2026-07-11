<template>


<div class="app">


<Header/>


<RTParameter/>


<div class="space"></div>


<ExperimentSummary/>


<div class="space"></div>


<RNADataTable/>


</div>


</template>



<script setup>


import Header from './components/Header.vue'

import RTParameter from './components/RTParameter.vue'

import ExperimentSummary from './components/ExperimentSummary.vue'

import RNADataTable from './components/RNADataTable.vue'


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

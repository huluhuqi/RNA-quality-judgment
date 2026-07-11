<template>


<el-card class="export-card">


<template #header>

<span>
报告导出
</span>

</template>



<el-button

type="success"

@click="excel"

>

导出Excel

</el-button>




<el-button

type="primary"

@click="pdf"

>

导出PDF

</el-button>



</el-card>


</template>




<script setup>


import {exportExcel}

from '../utils/export'


import {exportRNAReportPDF}

from '../utils/export'




const props =
defineProps({

summary:Object,

data:Array,

settings:Object,

summaryRef:Object

})





async function excel(){


let charts = {quality:null, pollution:null}

if(props.summaryRef?.getCharts){
    charts = await props.summaryRef.getCharts()
}


await exportExcel({

samples:props.data,

summary:props.summary,

settings:props.settings

}, charts)


}





function pdf(){


exportRNAReportPDF(

"pdf-report"

)


}


</script>


<style scoped>

.export-card{

background:

linear-gradient(

135deg,

#f7fff5,

#ffffff

);

}

</style>

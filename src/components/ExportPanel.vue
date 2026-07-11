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

from '../utils/excelExport'


import {exportPDF}

from '../utils/pdfExport'





const props =
defineProps({

summary:Object,

data:Array

})





function excel(){


exportExcel(

props.data

)


}





function pdf(){


exportPDF(

props.summary,

props.data

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

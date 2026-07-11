<template>


<el-card>


<template #header>

<div class="table-header">

<span>
RNA样本数据
</span>


<el-button
type="primary"
@click="addRow"
>
新增样本
</el-button>


</div>


</template>



<!-- 粘贴输入框 -->

<el-input

v-model="pasteText"

type="textarea"

:rows="5"

placeholder="
请从Excel复制数据：

模板ID  RNA浓度  A260/A280  A260/A230

然后粘贴到这里
"

@paste="handlePaste"

/>



<div class="btn-area">


<el-button
type="success"
@click="importData"
>
导入数据
</el-button>


<el-button
@click="clearData"
>
清空
</el-button>


</div>





<el-table

:data="tableData"

border

style="width:100%"

>




<el-table-column
label="模板ID"
>

<template #default="scope">

<el-input
v-model="scope.row.id"
/>

</template>

</el-table-column>




<el-table-column
label="RNA浓度"
>

<template #default="scope">

<el-input-number

v-model="scope.row.concentration"

:controls="false"

/>


</template>


</el-table-column>






<el-table-column
label="A260/A280"
>

<template #default="scope">

<el-input-number

v-model="scope.row.a260280"

:controls="false"

/>


</template>

</el-table-column>







<el-table-column
label="A260/A230"
>

<template #default="scope">


<el-input-number

v-model="scope.row.a260230"

:controls="false"

/>


</template>


</el-table-column>






<el-table-column
label="RNA质量"
/>




<el-table-column
label="污染分析"
/>




<el-table-column
label="建议"
/>




</el-table>




</el-card>


</template>





<script setup>


import {ref} from 'vue'


import {parsePasteData}

from '../utils/excelImport'





const pasteText = ref('')



const tableData = ref([])





function handlePaste(e){


}





function importData(){


const data = parsePasteData(
    pasteText.value
)


tableData.value.push(
    ...data
)


pasteText.value=''



}






function addRow(){


tableData.value.push({

id:'',

concentration:null,

a260280:null,

a260230:null


})


}






function clearData(){


tableData.value=[]


}




</script>






<style scoped>


.table-header{


display:flex;

justify-content:space-between;

align-items:center;


}



.btn-area{

margin:15px 0;

}



</style>

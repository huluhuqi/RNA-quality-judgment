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





<div class="table-container">

<el-table

:data="tableData"

:row-class-name="rowClass"

border

height="600"

stripe

style="width:100%"

>




<el-table-column
label="模板ID"
fixed="left"
width="140"
>

<template #default="scope">

<el-input
v-model="scope.row.id"
/>

</template>

</el-table-column>




<el-table-column

label="RNA浓度"

sortable

prop="concentration"

width="120"

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

sortable

prop="a260280"

width="130"

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

sortable

prop="a260230"

width="130"

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
width="100"
>


<template #default="scope">


<el-tag

:type="
getTagType(
getAnalysis(scope.row).quality
)
"

>

{{getAnalysis(scope.row).quality}}

</el-tag>


</template>


</el-table-column>




<el-table-column
label="污染分析"
width="260"
>


<template #default="scope">


<TextCell

:text="
getAnalysis(scope.row).pollution
"

/>


</template>


</el-table-column>




<el-table-column
label="建议"
width="300"
>


<template #default="scope">


<TextCell

:text="
getAnalysis(scope.row).suggestion
"

/>


</template>


</el-table-column>


<el-table-column

label="操作"

width="100"

fixed="right"

>


<template #default="scope">

<el-button-group>

<el-button

size="small"

@click="toggleIgnore(scope.row)"

>

{{

scope.row.ignored

?

"恢复"

:

"忽略"

}}

</el-button>

<el-button

type="danger"

size="small"

@click="deleteRow(scope.$index)"

>

删除

</el-button>

</el-button-group>

</template>


</el-table-column>




</el-table>

</div>




</el-card>


</template>





<script setup>


import {ref} from 'vue'

import {analyzeRNA}
from '../core/RNAQuality'


import {parsePasteData}

from '../utils/excelImport'


import TextCell
from './TextCell.vue'





const pasteText = ref('')



const tableData = ref([])


const emit = defineEmits([
    'update-data'
])


function getAnalysis(row){

    return analyzeRNA(row)

}


function handlePaste(e){


}





function importData(){


const data = parsePasteData(
    pasteText.value
)


tableData.value.push(
    ...data
)


emit(
'update-data',
tableData.value
)


pasteText.value=''



}






function addRow(){


tableData.value.push({

id:'',

concentration:null,

a260280:null,

a260230:null,

ignored:false

})


emit(
'update-data',
tableData.value
)


}






function clearData(){


tableData.value=[]


emit(
'update-data',
[]
)


}


function deleteRow(index){


tableData.value.splice(
index,
1
)


emit(
'update-data',
tableData.value
)


}


function toggleIgnore(row){


row.ignored =
!row.ignored


emit(
'update-data',
tableData.value
)


}


function rowClass({row}){


if(row.ignored){

return "ignored-row"

}


return ""


}


function getTagType(value){


switch(value){


case '优秀':

return 'success'


case '良好':

return ''


case '一般':

return 'warning'


case '较差':

return 'danger'


default:

return 'info'


}


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



.cell-text{

white-space:normal;

word-break:break-word;

line-height:1.5;

}


.table-container{

width:100%;

overflow-x:auto;

}


:deep(.ignored-row td){

text-decoration:line-through;

opacity:0.45;

}



</style>

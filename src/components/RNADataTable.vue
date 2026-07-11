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



<div class="btn-area button-group">


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





<div class="table-wrapper">
<div class="table-container">

<el-table

:data="tableData"

row-key="id"

:row-class-name="rowClass"

border

height="600"

stripe

style="min-width:1400px"

>




<el-table-column
label="模板ID"
fixed="left"
width="140"
>

<template #default="scope">

<el-input
v-model="scope.row.id"
@change="onCellChange(scope.row)"
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

@change="onCellChange(scope.row)"

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

@change="onCellChange(scope.row)"

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

@change="onCellChange(scope.row)"

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

width="180"

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
</div>




</el-card>


</template>





<script setup>


import {ref} from 'vue'

import {analyzeRNA}
from '../core/RNAQuality'


import {parsePasteData}

from '../utils/excelImport'


import {
saveHistory,
undo,
canUndo,
clearHistory
} from '../utils/historyManager'


import TextCell
from './TextCell.vue'


import {ElMessage} from 'element-plus'




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


function saveSnapshot(){
    saveHistory(tableData.value)
}


function onCellChange(row){
    saveSnapshot()
    emit(
        'update-data',
        tableData.value
    )
}


function importData(){


const data = parsePasteData(
    pasteText.value
)

if(data.length === 0){
    ElMessage.warning('未识别到有效数据')
    return
}

saveSnapshot()

tableData.value.push(
    ...data
)

emit(
'update-data',
tableData.value
)


pasteText.value=''

ElMessage.success(`成功导入${data.length}个样本`)


}



function addRow(){

saveSnapshot()

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

if(tableData.value.length === 0) return

saveSnapshot()

tableData.value=[]

emit(
'update-data',
[]
)

ElMessage.success('已清空数据')


}

function deleteRow(index){


const id =
tableData.value[index].id

const row =
document.querySelector(
`tr[data-row-key="${id}"]`
)

if(row){

row.style.transition="all .3s"
row.style.opacity=0
row.style.transform=
"translateX(-30px)"

}

saveSnapshot()

setTimeout(()=>{

tableData.value.splice(
index,
1
)

emit(
'update-data',
tableData.value
)

},300)


}


function toggleIgnore(row){

saveSnapshot()

row.ignored =
!row.ignored

emit(
'update-data',
tableData.value
)


}


function addSamples(list){
    if(!list || list.length === 0) return

    const duplicates = list.filter(item =>
        tableData.value.some(old => old.id === item.id)
    )

    if(duplicates.length > 0){
        ElMessage.warning(`${duplicates.length}个样本ID重复，已跳过`)
    }

    const unique = list.filter(item =>
        !tableData.value.some(old => old.id === item.id)
    )

    if(unique.length === 0){
        ElMessage.warning('所有样本ID均重复')
        return
    }

    saveSnapshot()

    tableData.value.push(...unique)

    emit('update-data', tableData.value)

    ElMessage.success(`成功导入${unique.length}个样本`)
}


function handleUndo(){
    if(canUndo()){
        const old = undo()
        if(old){
            tableData.value = old
            emit('update-data', tableData.value)
            ElMessage.success('已撤销')
        }
    } else {
        ElMessage.info('没有可撤销的操作')
    }
}


function onKeydown(e){
    if(e.ctrlKey && e.key === 'z'){
        e.preventDefault()
        handleUndo()
    }
}

if(typeof window !== 'undefined'){
    window.addEventListener('keydown', onKeydown)
}


defineExpose({
    addSamples,
    handleUndo,
    clearHistory
})


function rowClass({row}){


if(row.ignored){

return "ignored-row"

}


return "normal-row"


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

.button-group{

display:flex;

gap:10px;

flex-wrap:wrap;

}



.cell-text{

white-space:normal;

word-break:break-word;

line-height:1.5;

}


.table-wrapper{

width:100%;

overflow-x:auto;

}

.table-wrapper .el-table{

min-width:1400px;

}

.table-container{

width:100%;

}


/* 行级动画 */
.el-table__body tr{

transition:
transform .35s ease,
opacity .35s ease;

}

.table-row-move{

transition:
transform .35s ease;

}


/* 忽略行 - 渐变透明 + 左到右删除线 */
:deep(.ignored-row td){

position:relative;

opacity:.45;

animation:
ignoreFade .4s;

}

:deep(.ignored-row td::after){

content:"";

position:absolute;

left:0;

top:50%;

height:1px;

background:
currentColor;

width:0;

animation:
lineThrough .5s forwards;

}

@keyframes lineThrough{

from{
width:0;
}

to{
width:100%;
}

}

@keyframes ignoreFade{

from{
opacity:1;
}

to{
opacity:.45;
}

}


/* 恢复行 - 删除线反向消失 */
:deep(.normal-row td){

position:relative;

}

:deep(.normal-row td::after){

content:"";

position:absolute;

left:0;

top:50%;

height:1px;

background:
currentColor;

width:0;

animation:
lineRemove .3s;

}

@keyframes lineRemove{

from{
width:100%;
}

to{
width:0;
}

}



</style>

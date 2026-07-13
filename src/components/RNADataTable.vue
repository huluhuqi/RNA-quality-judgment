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



<!-- 四窗格粘贴输入区 -->

<div class="rna-input-grid">


<div
v-for="(column,index) in inputColumns"
:key="index"
class="input-box"
>


<div class="input-box-header">

<el-select
v-model="column.field"
size="small"
class="field-select"
>


<el-option

v-for="item in getAvailableFields(
column.field,
selectedFields
)"

:key="item.value"

:label="item.label"

:value="item.value"

/>


</el-select>

</div>


<el-input

v-model="column.text"

type="textarea"

:rows="8"

:placeholder="'请粘贴Excel单列数据'"

/>


</div>


</div>



<div class="btn-area button-group">


<el-button
type="success"
@click="importData"
>
导入数据
</el-button>


<el-button
@click="clearPasteData"
>
清空输入
</el-button>


<el-button
type="danger"
@click="clearData"
>
清空数据
</el-button>


</div>




<RNATable
:samples="tableData"
@delete="handleTableDelete"
@ignore="handleTableIgnore"
@cell-change="onCellChange"
/>



</el-card>


</template>




<script setup>

import {ref, computed} from 'vue'

import {
getAvailableFields
} from '../config/rnaInputFields'

import {
normalizeRNAData,
checkDuplicateIds
} from '../core/import/rnaDataNormalize'

import {
createSample,
normalizeSamples
} from '../core/sampleModel'

import {
QUALITY_LEVEL,
getQualityLabel
} from '../config/qualityLevel'

import {
saveHistory,
undo,
canUndo,
clearHistory
} from '../utils/historyManager'

import TextCell
from './TextCell.vue'

import SampleAdviceDetail
from './SampleAdviceDetail.vue'

import RNATable
from './rna/RNATable.vue'

import {ElMessage} from 'element-plus'


/**
 * 四窗格输入列
 *
 * 每个窗格：{ field: 字段value, text: 粘贴文本 }
 */
const inputColumns = ref([

    {
        field: "templateId",
        text: ""
    },

    {
        field: "concentration",
        text: ""
    },

    {
        field: "a260280",
        text: ""
    },

    {
        field: "a260230",
        text: ""
    }

]);


/**
 * 所有窗格已选字段列表（用于互斥）
 */
const selectedFields = computed(() => {

    return inputColumns.value.map(
        item => item.field
    );

});


const tableData = ref([])


const emit = defineEmits([
    'update-data'
])


/**
 * 解析单列文本为字符串数组
 */
function parseColumn(text){

    return text
        .split(/\n|\r\n/)
        .map(item => item.trim())
        .filter(item => item !== "");

}


/**
 * 将四窗格数据组合为样本数组
 *
 * 输出 templateId 字段，由 normalizeRNAData 统一处理
 */
function generateSamples(){

    const columns = {};

    inputColumns.value.forEach(item => {

        columns[item.field] =
            parseColumn(item.text);

    });

    const maxLength = Math.max(

        ...Object.values(columns)
            .map(arr => arr.length)

    );

    if(maxLength === 0 || maxLength === -Infinity){
        return [];
    }

    const result = [];

    for(let i = 0; i < maxLength; i++){

        result.push({

            templateId:
                columns.templateId?.[i]
                || "",

            concentration:
                columns.concentration?.[i]
                || null,

            a260280:
                columns.a260280?.[i]
                || null,

            a260230:
                columns.a260230?.[i]
                || null

        });

    }

    return result;

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

    const rawData = generateSamples()

    if(rawData.length === 0){
        ElMessage.warning('未识别到有效数据，请先粘贴数据')
        return
    }

    // 标准化：自动生成ID、清除空行、补齐缺失字段
    const normalized = normalizeRNAData(rawData)

    if(normalized.length === 0){
        ElMessage.warning('数据均为空行，请检查输入内容')
        return
    }

    // 重复ID检测
    const duplicates = checkDuplicateIds(normalized)

    if(duplicates.length > 0){
        ElMessage.warning(`检测到${duplicates.length}个重复模板ID，请检查`)
    }

    // 统计自动生成ID数量（匹配 YYYYMMDD_XXX 格式）
    const dateStr = (() => {
        const d = new Date()
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}${m}${day}`
    })()
    const autoIdPattern = new RegExp(`^${dateStr}_\\d{3}$`)
    const autoIdCount = normalized.filter(item =>
        autoIdPattern.test(item.templateId)
    ).length

    // 映射为 sampleModel 兼容格式（templateId → id）
    const mapped = normalized.map(item => ({
        id: item.templateId,
        concentration: item.concentration,
        a260280: item.a260280,
        a260230: item.a260230
    }))

    saveSnapshot()

    tableData.value.push(
        ...normalizeSamples(mapped)
    )

    emit(
        'update-data',
        tableData.value
    )

    clearPasteData()

    let msg = `成功导入${normalized.length}个样本`
    if(autoIdCount > 0){
        msg += `，自动生成ID ${autoIdCount}个`
    }
    ElMessage.success(msg)

}


/**
 * 清空所有输入窗格文本
 */
function clearPasteData(){

    inputColumns.value.forEach(item => {
        item.text = ""
    });

}


function addRow(){

    saveSnapshot()

    tableData.value.push(
        createSample({})
    )

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


function handleTableDelete(row){
    const index = tableData.value.findIndex(item => item.id === row.id)
    if(index !== -1){
        tableData.value.splice(index, 1)
        emit('update-data', tableData.value)
    }
}

function handleTableIgnore(row){
    emit('update-data', tableData.value)
}

defineExpose({
    addSamples,
    handleUndo,
    clearHistory
})


</script>




<style scoped>


.table-header{


    display:flex;


    justify-content:space-between;


    align-items:center;


}


/* 四窗格输入区 */
.rna-input-grid{

    display:grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap:15px;

    margin-bottom:15px;

}

.input-box{

    background:
        var(--card-bg, #ffffff);

    padding:15px;

    border-radius:10px;

    border:1px solid var(--border-color, #e4e7ed);

}

.input-box-header{

    margin-bottom:10px;

}

.field-select{

    width:100%;

}

@media(max-width:1000px){

    .rna-input-grid{

        grid-template-columns:
            repeat(2, 1fr);

    }

}

@media(max-width:600px){

    .rna-input-grid{

        grid-template-columns:
            1fr;

    }

}


.btn-area{

    margin:15px 0;
}

.button-group{

    display:flex;

    gap:10px;

    flex-wrap:wrap;

}


</style>

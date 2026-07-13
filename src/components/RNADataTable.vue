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

<RNAImport @import="handleImport" />

<div class="table-actions">
    <el-button
    type="danger"
    @click="clearData"
    >
    清空数据
    </el-button>
</div>

<RNATable
:samples="store.samples"
:removingIds="store.removingIds"
@delete="handleTableDelete"
@ignore="handleTableIgnore"
@cell-change="onCellChange"
/>


</el-card>

</template>


<script setup>

import { onMounted, onBeforeUnmount } from 'vue'
import { useSampleStore } from '../store/sampleStore'

import {
saveHistory,
undo,
canUndo,
clearHistory
} from '../utils/historyManager'

import RNAImport
from './RNAImport.vue'

import RNATable
from './rna/RNATable.vue'

import {ElMessage} from 'element-plus'

import { handleError } from '../core/error/errorHandler'
import { ErrorType } from '../core/error/errorType'

const store = useSampleStore()

function saveSnapshot(){
    saveHistory(store.samples)
}

function onCellChange(row){
    saveSnapshot()
}

function handleImport(samples) {
    try {
        saveSnapshot()
        store.importSamples(samples)
        store.analyzeAll()
    } catch (e) {
        handleError(e, ErrorType.FILE_IMPORT, 'RNA数据导入')
        ElMessage.error('数据导入失败，请检查数据格式')
    }
}

function addRow(){

    saveSnapshot()

    store.addSample({
        templateId: "",
        concentration: "",
        a260280: "",
        a260230: ""
    })

}

function clearData(){

    if(store.samples.length === 0) return

    saveSnapshot()

    store.clearSamples()

    ElMessage.success('已清空数据')

}

function addSamples(list){
    if(!list || list.length === 0) return

    const duplicates = list.filter(item =>
        store.samples.some(old => old.id === item.id)
    )

    if(duplicates.length > 0){
        ElMessage.warning(`${duplicates.length}个样本ID重复，已跳过`)
    }

    const unique = list.filter(item =>
        !store.samples.some(old => old.id === item.id)
    )

    if(unique.length === 0){
        ElMessage.warning('所有样本ID均重复')
        return
    }

    saveSnapshot()

    unique.forEach(sample => {
        store.addSample(sample)
    })

    ElMessage.success(`成功导入${unique.length}个样本`)
}

function handleUndo(){
    if(canUndo()){
        const old = undo()
        if(old){
            store.setSamples(old)
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

onMounted(() => {
    if(typeof window !== 'undefined'){
        window.addEventListener('keydown', onKeydown)
    }
})

onBeforeUnmount(() => {
    if(typeof window !== 'undefined'){
        window.removeEventListener('keydown', onKeydown)
    }
})

function handleTableDelete(row){
    store.deleteSample(row.id)
}

function handleTableIgnore(row){
    store.ignoreSample(row.id)
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

.table-actions{
    display: flex;
    justify-content: flex-end;
    margin: 15px 0;
    gap: 10px;
}

</style>
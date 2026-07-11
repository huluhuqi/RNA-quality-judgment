<template>

<el-card class="data-input-card">

<template #header>
<div class="header-title">
批量导入RNA数据
</div>
</template>


<el-input

type="textarea"

:rows="6"

placeholder="请从Excel复制数据粘贴到这里（支持3列或4列）：

3列格式：模板ID	A260/280	A260/230
4列格式：模板ID	RNA浓度	A260/280	A260/230

示例：
RNA001	2.05	2.15
RNA002	1.98	1.75"

v-model="pasteText"

@paste="handlePaste"

/>


<div class="buttons">

<el-button

type="primary"

@click="importData"

>
导入数据
</el-button>


<el-button

@click="clearInput"

>
清空输入
</el-button>

</div>


<div v-if="errorList.length" class="error-list">

<div
v-for="(err, i) in errorList"
:key="i"
class="error-item"
>
<el-alert
:type="err.type"
:title="err.title"
:description="err.desc"
show-icon
:closable="false"
/>
</div>

</div>


</el-card>

</template>


<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import { parsePasteData } from '../utils/pasteParser'
import { validateBatch } from '../utils/dataValidator'

const pasteText = ref('')
const errorList = ref([])

const emit = defineEmits([
    'add',
    'check-duplicate'
])

function handlePaste(e){
    console.log("检测到Excel粘贴")
}

function clearInput(){
    pasteText.value = ''
    errorList.value = []
}

function importData(){

    errorList.value = []

    if(!pasteText.value.trim()){
        ElMessage.warning('请先粘贴数据')
        return
    }

    const data = parsePasteData(pasteText.value)

    if(data.length === 0){
        ElMessage.warning('未识别到有效数据，请检查格式（至少3列，用Tab分隔）')
        return
    }

    const { valid, invalid } = validateBatch(data)

    invalid.forEach(({ item, errors })=>{
        errorList.value.push({
            type: 'warning',
            title: `${item.id || '未知样本'} 数据异常`,
            desc: errors.join('；')
        })
    })

    if(valid.length === 0){
        ElMessage.error('没有有效数据可导入')
        return
    }

    emit('add', valid)

}

function showSuccess(count){
    ElMessage.success({
        message: `成功导入${count}个样本`,
        duration: 2000
    })
}

defineExpose({
    showSuccess,
    showError(msg){
        ElMessage.error(msg)
    },
    showDuplicate(count){
        ElMessage.warning(`${count}个样本ID重复`)
    }
})

</script>


<style scoped>

.data-input-card{
    background:
        linear-gradient(
            135deg,
            #f0f9ff,
            #ffffff
        );
}

.header-title{
    font-size:16px;
    font-weight:bold;
}

.buttons{
    margin-top:12px;
    display:flex;
    gap:10px;
    flex-wrap:wrap;
}

:deep(.el-textarea__inner){
    transition: all .3s;
}

:deep(.el-textarea__inner:focus){
    box-shadow: 0 0 10px rgba(64,158,255,.3);
}

.error-list{
    margin-top:12px;
}

.error-item{
    margin-bottom:8px;
}

</style>

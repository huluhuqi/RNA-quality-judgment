<template>


<el-card>


<template #header>

<span>
RNA样本数据
</span>

</template>


<el-table
:data="tableData"
border
>


<el-table-column
prop="id"
label="模板ID"
/>


<el-table-column
prop="concentration"
label="RNA浓度"
/>


<el-table-column
prop="a260280"
label="A260/A280"
/>


<el-table-column
prop="a260230"
label="A260/A230"
/>


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


import { ref } from 'vue'


const tableData = ref([])



</script>

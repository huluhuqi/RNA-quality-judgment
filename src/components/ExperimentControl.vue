<template>


<el-card>


<template #header>

<span>
实验管理
</span>

</template>



<el-button

type="primary"

@click="newExperiment"

>

新建实验

</el-button>




<el-button

type="danger"

@click="clear"

>

清空数据

</el-button>



</el-card>


</template>



<script setup>


const emit =
defineEmits([

"new",

"clear"

])




function newExperiment(){


emit("new")


}




function clear(){


emit("clear")


}


</script>

<template>


<el-card>

  <template #header>

    <span>
      反转录参数设置
    </span>

  </template>



  <el-row :gutter="20">


    <el-col :span="8">

      <el-form-item label="最大RNA上样量">

        <el-input-number
          v-model="config.maxRNA"
          :min="1"
        />

        <span>
          ng
        </span>

      </el-form-item>


    </el-col>



    <el-col :span="8">

      <el-form-item label="最小RNA上样量">


        <el-input-number
          v-model="config.minRNA"
          :min="1"
        />


        <span>
          ng
        </span>


      </el-form-item>


    </el-col>




    <el-col :span="8">


      <el-form-item label="最大模板体积">


        <el-input-number
          v-model="config.maxVolume"
          :min="1"
        />


        <span>
          μL
        </span>


      </el-form-item>


    </el-col>


  </el-row>



</el-card>


</template>



<script setup>


import { reactive } from 'vue'


const config = reactive({

  maxRNA:1000,

  minRNA:10,

  maxVolume:12

})


</script>

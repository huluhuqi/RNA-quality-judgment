<template>

  <div class="header">

    <div class="header-content">

      <div class="header-text">

        <h1>
          RNA Quality Judgment
        </h1>


        <p>
          RNA质量检测、污染分析及反转录模板推荐工具
        </p>

      </div>

      <ThemeSwitch/>

    </div>

  </div>


</template>

<script setup>

import ThemeSwitch from './ThemeSwitch.vue'

</script>


<style scoped>

.header{

  margin-bottom:25px;

}

.header-content{

  display:flex;

  justify-content:space-between;

  align-items:center;

}

.header-text{

  text-align:left;

}

h1{

  font-size:32px;

  margin-bottom:10px;

}

p{

  color:#666;

}

@media (max-width:768px){

  h1{

    font-size:24px;

  }

}

</style>

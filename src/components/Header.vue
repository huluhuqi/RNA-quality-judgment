<template>

  <div class="header">

    <div class="header-content">

      <div class="header-text">

        <h1>
          RNA质量检测工具
        </h1>

      </div>

      <ThemeSelector/>

    </div>

  </div>


</template>

<script setup>

import ThemeSelector from './ThemeSelector.vue'

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

  margin-bottom:0;

}

@media (max-width:768px){

  h1{

    font-size:24px;

  }

}

</style>

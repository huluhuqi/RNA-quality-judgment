<template>


<div>


<div

class="text-cell"

:class="{
expand:isExpand
}"

@click="isExpand=!isExpand"

>


{{text}}


</div>



</div>


</template>




<script setup>


import {ref} from 'vue'


defineProps({

text:{

type:String,

default:''

}

})


const isExpand=ref(false)



</script>




<style scoped>


.text-cell{


line-height:1.5;

cursor:pointer;

overflow:hidden;


display:-webkit-box;

-webkit-box-orient:vertical;

-webkit-line-clamp:4;


}



.expand{


-webkit-line-clamp:unset;

}



</style>

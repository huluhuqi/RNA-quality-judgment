<template>

<div 
ref="chartRef"
class="chart"
>
</div>

</template>



<script setup>

import {
ref,
onMounted,
watch,
onBeforeUnmount
}
from 'vue'


import * as echarts from 'echarts'



const props = defineProps({

data:{

type:Object,

default:()=>({})

}

})



const chartRef=ref(null)


let chart=null





function render(){


if(!chart){


chart=
echarts.init(
chartRef.value
)

}



chart.setOption({

tooltip:{


trigger:'item'


},



legend:{


bottom:0


},



series:[


{

type:'pie',

radius:[
'45%',
'70%'
],



avoidLabelOverlap:false,


label:{

show:true,

formatter:'{b}: {c}'

},



data:[

{

value:
props.data.优秀||0,

name:'优秀'

},


{

value:
props.data.良好||0,

name:'良好'

},


{

value:
props.data.一般||0,

name:'一般'

},


{

value:
props.data.较差||0,

name:'较差'

},


{

value:
props.data.待检测||0,

name:'待检测'

}


]


}

]

})


}





onMounted(()=>{


render()


window.addEventListener(

'resize',

()=>chart?.resize()

)


})





watch(

()=>props.data,

()=>{

render()

},

{
deep:true
}

)



onBeforeUnmount(()=>{


chart?.dispose()


})



</script>




<style scoped>


.chart{

width:100%;

height:260px;


}


</style>

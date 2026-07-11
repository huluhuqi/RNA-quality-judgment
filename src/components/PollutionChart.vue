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



import * as echarts

from 'echarts'

import {
getTheme
}
from '../theme/theme'





const props=

defineProps({

data:Object

})




const chartRef=ref(null)


let chart=null





function render(){

if(chart){
    chart.dispose()
}

chart =
echarts.init(
chartRef.value,
getTheme()==='dark'
?
'dark'
:
null
)



chart.setOption({


tooltip:{},


xAxis:{


type:'category',


data:[

'蛋白/酚类污染',

'盐类/试剂残留',

'双重风险'

]


},



yAxis:{


type:'value'

},



series:[


{

type:'bar',


data:[

props.data?.蛋白或酚类污染||0,

props.data?.盐类或试剂残留||0,

props.data?.双重污染风险||0

]


}

]


})


}




onMounted(()=>{

render()


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

watch(
    ()=>getTheme(),
    ()=>{
        render()
    }
)

onBeforeUnmount(()=>{


chart?.dispose()


})



</script>




<style scoped>


.chart{

height:260px;

width:100%;


}


</style>

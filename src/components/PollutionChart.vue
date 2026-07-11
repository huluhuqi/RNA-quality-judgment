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




const props=

defineProps({

data:Object

})




const chartRef=ref(null)


let chart=null



function getChartTextColor(){
    return getComputedStyle(
        document.documentElement
    )
    .getPropertyValue('--chart-text')
    .trim()
    ||
    '#303133'
}



function render(){

if(chart){
    chart.dispose()
}

chart =
echarts.init(
chartRef.value
)

const textColor = getChartTextColor()

chart.setOption({

backgroundColor:'transparent',

tooltip:{},


xAxis:{


type:'category',


data:[

'蛋白/酚类污染',

'盐类/试剂残留',

'双重风险'

],

axisLabel:{
color:textColor
}

},



yAxis:{


type:'value',
axisLabel:{
color:textColor
}

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

window.addEventListener(

'resize',

()=>chart?.resize()

)

window.addEventListener(

'theme-change',

()=>{

if(chart){
chart.dispose()
chart=null
}

render()

}

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

window.removeEventListener('theme-change', render)

})



</script>




<style scoped>


.chart{

height:260px;

width:100%;

min-width:260px;

}


</style>

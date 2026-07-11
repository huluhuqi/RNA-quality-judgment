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


import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    PieChart,
    TooltipComponent,
    LegendComponent,
    CanvasRenderer
])

import {
getChartTheme,
getChartTextColor
}
from '../theme/chartTheme'

import {
QUALITY_LEVEL,
PENDING
}
from '../config/qualityLevel'



const props = defineProps({

data:{

type:Object,

default:()=>({})

}

})



const chartRef=ref(null)


let chart=null



/**
 * 根据容器宽度计算字体大小，避免小屏文字遮挡
 */
function getFontSize(){
    const width = chartRef.value?.clientWidth || 360
    return width < 400 ? 10 : 14
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
const fontSize = getFontSize()

chart.setOption({

...getChartTheme(),

tooltip:{


trigger:'item'


},



legend:{


bottom:0,
textStyle:{
color:textColor,
fontSize
}


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
formatter:'{b}: {c}',
color:textColor,
fontSize

},



data:[

{

value:
props.data[QUALITY_LEVEL.EXCELLENT.value]||0,

name: QUALITY_LEVEL.EXCELLENT.label

},


{

value:
props.data[QUALITY_LEVEL.GOOD.value]||0,

name: QUALITY_LEVEL.GOOD.label

},


{

value:
props.data[QUALITY_LEVEL.WARNING.value]||0,

name: QUALITY_LEVEL.WARNING.label

},


{

value:
props.data[QUALITY_LEVEL.POOR.value]||0,

name: QUALITY_LEVEL.POOR.label

},


{

value:
props.data[PENDING.value]||0,

name: PENDING.label

}


]


}
]

})


}



/**
 * 窗口缩放回调（具名，便于移除）
 */
function handleResize(){
    chart?.resize()
}


/**
 * 主题变更回调（具名，便于移除）
 */
function handleThemeChange(){
    if(chart){
        chart.dispose()
        chart=null
    }
    render()
}




onMounted(()=>{


render()


window.addEventListener(
'resize',
handleResize
)

window.addEventListener(
'theme-change',
handleThemeChange
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

window.removeEventListener('resize', handleResize)
window.removeEventListener('theme-change', handleThemeChange)

})


defineExpose({

async getImage(){

return new Promise(
resolve=>{

if(chart){
chart.resize()
}

const canvas =
chartRef.value
?.querySelector("canvas")

if(!canvas){
resolve(null)
return
}

resolve(
canvas.toDataURL(
"image/png"
)
)

}

)
}

})


</script>




<style scoped>


.chart{

width:100%;

height:260px;

min-width:260px;

}


</style>

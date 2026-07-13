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
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    BarChart,
    TooltipComponent,
    GridComponent,
    CanvasRenderer
])

import {
getChartTheme,
getChartTextColor,
getChartGridColor
}
from '../theme/chartTheme'

import { useSampleStore } from '../store/sampleStore'

const store = useSampleStore()

const props=
defineProps({
data:Object
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

tooltip:{},


xAxis:{


type:'category',


data:[

'蛋白/酚类污染',

'盐类/试剂残留',

'双重风险'

],

axisLabel:{
color:textColor,
fontSize
}

},



yAxis:{


type:'value',
axisLabel:{
color:textColor,
fontSize
},
splitLine:{
lineStyle:{
color: getChartGridColor()
}
}

},



series:[


{

type:'bar',


data:[


{

value:
props.data?.蛋白或酚类污染||0,

name:'蛋白/酚类污染',

itemStyle:{

color:'#e74c3c'

}

},



{

value:
props.data?.盐类或试剂残留||0,

name:'盐类/试剂残留',

itemStyle:{

color:'#f39c12'

}

},



{

value:
props.data?.双重污染风险||0,

name:'双重污染风险',

itemStyle:{

color:'#8e44ad'

}

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

watch(() => store.dirty, () => {
render()
})



onBeforeUnmount(()=>{


chart?.dispose()

window.removeEventListener('resize', handleResize)
window.removeEventListener('theme-change', handleThemeChange)

})


defineExpose({

async getImage(){

if(chart){
chart.resize()
}

const canvas =
chartRef.value
?.querySelector("canvas")

if(!canvas)
return null

return canvas.toDataURL(
"image/png"
)

}

})


</script>




<style scoped>


.chart{

height:260px;

width:100%;

min-width:260px;

}


</style>

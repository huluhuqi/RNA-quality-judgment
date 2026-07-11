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


const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null


function getFontSize(){
    const width = chartRef.value?.clientWidth || 360
    return width < 400 ? 10 : 14
}


function render(){

    if(chart){
        chart.dispose()
    }

    chart = echarts.init(chartRef.value)

    const textColor = getChartTextColor()
    const fontSize = getFontSize()

    const names = props.data.map(item => item.name)
    const values = props.data.map(item => item.value)

    chart.setOption({

        ...getChartTheme(),

        tooltip: {},

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },

        xAxis: {
            type: 'category',
            data: names,
            axisLabel: {
                color: textColor,
                fontSize,
                rotate: names.length > 4 ? 20 : 0,
                interval: 0,
                formatter(value){
                    if(value.length > 10){
                        return value.slice(0, 10) + '...'
                    }
                    return value
                }
            }
        },

        yAxis: {
            type: 'value',
            axisLabel: {
                color: textColor,
                fontSize
            },
            splitLine: {
                lineStyle: {
                    color: getChartGridColor()
                }
            }
        },

        series: [
            {
                type: 'bar',
                data: values.map((v, i) => ({
                    value: v,
                    itemStyle: {
                        color: barColor(i)
                    }
                })),
                barMaxWidth: 40,
                label: {
                    show: true,
                    position: 'top',
                    color: textColor,
                    fontSize: fontSize - 1
                }
            }
        ]

    })

}


function barColor(index){
    const colors = [
        '#e74c3c',
        '#f39c12',
        '#8e44ad',
        '#16a085',
        '#2980b9',
        '#d35400',
        '#27ae60',
        '#c0392b'
    ]
    return colors[index % colors.length]
}


function handleResize(){
    chart?.resize()
}

function handleThemeChange(){
    if(chart){
        chart.dispose()
        chart = null
    }
    render()
}


onMounted(() => {
    render()
    window.addEventListener('resize', handleResize)
    window.addEventListener('theme-change', handleThemeChange)
})


watch(
    () => props.data,
    () => {
        render()
    },
    { deep: true }
)


onBeforeUnmount(() => {
    chart?.dispose()
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('theme-change', handleThemeChange)
})


defineExpose({
    async getImage(){
        if(chart){
            chart.resize()
        }
        const canvas = chartRef.value?.querySelector('canvas')
        if(!canvas) return null
        return canvas.toDataURL('image/png')
    }
})

</script>

<style scoped>

.chart{
    width: 100%;
    height: 280px;
    min-width: 260px;
}

</style>

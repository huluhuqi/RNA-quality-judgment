<template>

<div class="app-container">

    <Header />

    <div class="experiment-status" v-if="samples.length > 0">
        <span class="status-item">
            <span class="status-label">有效样本</span>
            <span class="status-value">{{ summary.validCount }}</span>
        </span>
        <span class="status-divider">|</span>
        <span class="status-item">
            <span class="status-label">异常</span>
            <span class="status-value warning">{{ summary.qualityCount.poor + summary.qualityCount.fail }}</span>
        </span>
        <span class="status-divider">|</span>
        <span class="status-item">
            <span class="status-label">已忽略</span>
            <span class="status-value info">{{ summary.ignoredCount }}</span>
        </span>
    </div>

    <div class="action-bar">
        <div class="action-left">
            <button class="app-btn primary" @click="handleImport">导入数据</button>
            <button class="app-btn info" @click="handleAddSample">新增样本</button>
        </div>
        <div class="action-right">
            <button class="app-btn success" @click="handleExportExcel">导出Excel</button>
            <button class="app-btn info" @click="handleExportPDF">导出PDF</button>
            <button class="app-btn danger" @click="handleClear">清空数据</button>
        </div>
    </div>

    <CollapseCard title="实验参数" :defaultOpen="true">
        <RTParameter @update-config="updateRTConfig" />
    </CollapseCard>

    <CollapseCard title="本次实验总体分析" :defaultOpen="true">
        <ExperimentSummary
            ref="summaryRef"
            :summary="summary"
            :samples="samples"
        />
    </CollapseCard>

    <CollapseCard title="RNA样本数据" :defaultOpen="true">
        <EmptyState
            v-if="samples.length === 0"
            title="暂无RNA样本数据"
            subtitle="请导入或新增RNA样本数据开始分析"
            button-text="导入RNA数据"
            @action="handleImport"
        />
        <RNADataTable
            v-else
            ref="rnaTableRef"
            @update-data="updateData"
        />
    </CollapseCard>

    <CollapseCard title="实验建议" :defaultOpen="false">
        <ExportPanel
            :summary="summary"
            :data="samples"
            :settings="rtConfig"
            :summaryRef="summaryRef"
        />
    </CollapseCard>

    <LoadingOverlay :show="uiState.loading" :message="uiState.loadingMessage" />

</div>

</template>

<script setup>

import './assets/style.css'
import './assets/theme.css'
import './styles/theme.css'

import { initTheme } from './theme/theme'
initTheme()

import { ref, watch, onMounted } from 'vue'

import Header from './components/Header.vue'
import RTParameter from './components/RTParameter.vue'
import ExperimentSummary from './components/ExperimentSummary.vue'
import RNADataTable from './components/RNADataTable.vue'
import ExportPanel from './components/ExportPanel.vue'

import CollapseCard from './components/common/CollapseCard.vue'
import EmptyState from './components/common/EmptyState.vue'
import LoadingOverlay from './components/common/LoadingOverlay.vue'

import { calculateBatch } from './core/BatchStatistics'
import { analyzeSamples } from './core/analyzer/sampleAnalyzer'
import { calculateRT, checkConcentrationDistribution } from './core/RTRecommendation'
import { QUALITY_LEVEL, PENDING } from './config/qualityLevel'
import { saveExperiment, loadExperiment, clearExperiment } from './utils/storage'
import { getValidSamples } from './core/sample/sampleUtils'

import { uiState, setLoading } from './store/uiState'

const summary = ref({
    totalCount:0,
    validCount:0,
    ignoredCount:0,
    pendingCount:0,
    avgConcentration:0,
    minConcentration:0,
    maxConcentration:0,
    quality:'暂无数据',
    qualityCount:{
        [QUALITY_LEVEL.EXCELLENT.value]:0,
        [QUALITY_LEVEL.GOOD.value]:0,
        [QUALITY_LEVEL.WARNING.value]:0,
        [QUALITY_LEVEL.POOR.value]:0,
        [QUALITY_LEVEL.FAIL.value]:0,
        [PENDING.value]:0
    },
    pollution:'暂无数据',
    pollutionSamples:[],
    rt:{
        recommendedRNA:0,
        minVolume:0,
        maxVolume:0,
        suggestion:''
    },
    noConcentrationCount:0,
    noA260280Count:0,
    partialPollutionCount:0
})

const samples = ref([])
const rnaTableRef = ref(null)
const summaryRef = ref(null)

const rtConfig = ref({
    method:'硅胶膜柱提法',
    maxRNA:1000,
    minRNA:10,
    maxVolume:12
})

function updateData(data){
    samples.value = data
    refreshAnalysis()
}

function refreshAnalysis(){
    setLoading(true, "正在分析RNA数据...")
    setTimeout(() => {
        try {
            const data = samples.value
            const analyzed = analyzeSamples(data, rtConfig.value)
            data.forEach((item, i) => {
                item.result = analyzed[i].result
            })

            const batch = calculateBatch(data, rtConfig.value.method, rtConfig.value.application)
            const validSamples = getValidSamples(data)

            batch.rt = calculateRT(validSamples, rtConfig.value)
            batch.rtWarning = checkConcentrationDistribution(validSamples)

            summary.value = batch
        } finally {
            setLoading(false)
        }
    }, 100)
}

function updateRTConfig(config){
    rtConfig.value = config
    refreshAnalysis()
}

function handleImport(){
    if(rnaTableRef.value){
        rnaTableRef.value.$el.querySelector('.rna-input-grid textarea')?.focus()
    }
}

function handleAddSample(){
    if(rnaTableRef.value){
        rnaTableRef.value.addRow()
    }
}

function handleExportExcel(){
    setLoading(true, "正在生成Excel报告...")
    setTimeout(() => {
        try {
            const event = new CustomEvent('export-excel')
            window.dispatchEvent(event)
        } finally {
            setLoading(false)
        }
    }, 100)
}

function handleExportPDF(){
    setLoading(true, "正在生成PDF报告...")
    setTimeout(() => {
        try {
            const event = new CustomEvent('export-pdf')
            window.dispatchEvent(event)
        } finally {
            setLoading(false)
        }
    }, 100)
}

function handleClear(){
    samples.value = []
    clearExperiment()
    updateData([])
}

watch(samples, (value) => {
    saveExperiment({
        samples: value,
        rtConfig: rtConfig.value
    })
}, { deep: true })

onMounted(() => {
    const saved = loadExperiment()
    if(saved){
        samples.value = saved.samples || []
        rtConfig.value = saved.rtConfig || {
            maxRNA:1000,
            minRNA:10,
            maxVolume:12
        }
        updateData(samples.value)
    }
})

</script>

<style scoped>

.app-container{
    min-height: 100vh;
    background: var(--bg-color);
    padding: 20px;
    transition: all .3s;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
}

@media(max-width: 900px){
    .app-container{
        padding: 10px;
    }
}

.experiment-status{
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 20px;
    background: var(--card-bg);
    border-radius: 10px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
}

.status-item{
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-label{
    font-size: 13px;
    color: var(--text-secondary);
}

.status-value{
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
}

.status-value.warning{
    color: var(--warning-color);
}

.status-value.info{
    color: var(--text-secondary);
}

.status-divider{
    color: var(--border-color);
}

.action-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
}

.action-left,
.action-right{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

@media(max-width: 768px){
    .action-bar{
        flex-direction: column;
        align-items: stretch;
    }
    .action-left,
    .action-right{
        justify-content: center;
    }
}

</style>

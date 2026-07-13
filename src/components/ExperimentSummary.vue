<template>

<div id="pdf-report" class="summary-container">

<!-- 实验总体结论 -->
<el-card class="summary-conclusion pdf-section">
    <div class="conclusion-header">
        <h3>实验总体结论</h3>
        <el-tag :type="conclusionType">{{ conclusionLabel }}</el-tag>
    </div>
    <div class="conclusion-content">
        <SummaryConclusion :text="batchSummary.conclusion" :type="conclusionType" />
    </div>
</el-card>

<!-- 第一层核心指标（保留原有卡片） -->
<el-row :gutter="16" class="top-summary pdf-section">
    <el-col :xs="24" :sm="12" :lg="6">
        <OverviewCard :summary="summary" />
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6">
        <QualityCard :summary="summary" />
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6">
        <ApplicationCard :summary="summary" />
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6">
        <RTRecommendCard :summary="summary" />
    </el-col>
</el-row>

<!-- 分析图表 2x2 网格 -->
<div class="chart-grid pdf-section">
    <QualityChartCard
        ref="qualityChartRef"
        :summary="summary"
    />
    <PollutionCard
        ref="pollutionChartRef"
        :summary="summary"
    />
    <ExtractionProblemCard
        ref="extractionChartRef"
        :summary="summary"
    />
    <el-card shadow="hover" class="rt-detail-card">
        <RTSummary 
            :data="summary.rt || {}" 
            :recommend="batchSummary.rt.recommend" 
            :cannot="batchSummary.rt.cannot" 
        />
    </el-card>
</div>

</div>

</template>

<script setup>

import { ref, computed, defineExpose } from 'vue';
import { useSampleStore } from '../store/sampleStore';
import { generateBatchSummary } from '../core/summary/batchSummary';

import OverviewCard from './summary/OverviewCard.vue';
import QualityCard from './summary/QualityCard.vue';
import ApplicationCard from './summary/ApplicationCard.vue';
import RTRecommendCard from './summary/RTRecommendCard.vue';
import QualityChartCard from './summary/QualityChartCard.vue';
import PollutionCard from './summary/PollutionCard.vue';
import ExtractionProblemCard from './summary/ExtractionProblemCard.vue';
import SummaryConclusion from './summary/SummaryConclusion.vue';
import QualityDistribution from './summary/QualityDistribution.vue';
import ExtractionSummary from './summary/ExtractionSummary.vue';
import RTSummary from './summary/RTSummary.vue';

const store = useSampleStore();

const qualityChartRef = ref(null);
const pollutionChartRef = ref(null);
const extractionChartRef = ref(null);

const props = defineProps({
    summary: {
        type: Object,
        default: () => ({})
    }
});

const batchSummary = computed(() => {
    return generateBatchSummary(store.validSamples);
});

const conclusionType = computed(() => {
    const total = batchSummary.value.total;
    if (total === 0) return 'info';
    const poor = batchSummary.value.quality.poor + batchSummary.value.quality.fail;
    const poorRate = poor / total;
    if (poorRate < 0.1) return 'success';
    if (poorRate < 0.3) return 'warning';
    return 'danger';
});

const conclusionLabel = computed(() => {
    const total = batchSummary.value.total;
    if (total === 0) return '暂无数据';
    const poor = batchSummary.value.quality.poor + batchSummary.value.quality.fail;
    const poorRate = poor / total;
    if (poorRate < 0.1) return '质量良好';
    if (poorRate < 0.3) return '质量一般';
    return '质量较差';
});

defineExpose({
    async getCharts() {
        return {
            quality: await qualityChartRef.value?.getImage(),
            pollution: await pollutionChartRef.value?.getImage(),
            extraction: await extractionChartRef.value?.getImage()
        };
    }
});

</script>

<style scoped>

.summary-container{
    width: 100%;
}

.summary-conclusion{
    background:
        linear-gradient(
            135deg,
            var(--card-conclusion-from, #667eea),
            var(--card-conclusion-to, #764ba2)
        );
    margin-bottom: 20px;
}

.conclusion-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.conclusion-header h3{
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
}

.conclusion-content p{
    margin: 0;
    color: rgba(255, 255, 255, 0.95);
    font-size: 15px;
    line-height: 1.8;
    white-space: pre-line;
}

.chart-grid{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
}

@media (max-width: 900px){
    .chart-grid{
        grid-template-columns: 1fr;
    }
}

.batch-stats{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 16px;
}

@media (max-width: 1200px){
    .batch-stats{
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px){
    .batch-stats{
        grid-template-columns: 1fr;
    }
}

.batch-stat-card{
    background: var(--card-bg, #ffffff);
}

.card-title{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
}

.quality-stat-grid{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.stat-item{
    flex: 1;
    min-width: 80px;
    text-align: center;
    padding: 12px 8px;
    border-radius: 8px;
}

.stat-item .stat-value{
    display: block;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
}

.stat-item .stat-label{
    font-size: 12px;
    color: var(--text-light, #606266);
}

.stat-item.excellent{
    background: rgba(103, 194, 58, 0.1);
}
.stat-item.excellent .stat-value{
    color: #67c23a;
}

.stat-item.good{
    background: rgba(64, 158, 255, 0.1);
}
.stat-item.good .stat-value{
    color: #409eff;
}

.stat-item.warning{
    background: rgba(230, 162, 60, 0.1);
}
.stat-item.warning .stat-value{
    color: #e6a23c;
}

.stat-item.poor{
    background: rgba(245, 108, 108, 0.1);
}
.stat-item.poor .stat-value{
    color: #f56c6c;
}

.stat-item.unknown{
    background: rgba(144, 147, 153, 0.1);
}
.stat-item.unknown .stat-value{
    color: #909399;
}

.pollution-list,
.extraction-list{
    max-height: 200px;
    overflow-y: auto;
}

.pollution-item,
.extraction-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border, #e4e7ed);
}

.pollution-item:last-child,
.extraction-item:last-child{
    border-bottom: none;
}

.pollution-type,
.extraction-problem{
    font-size: 13px;
    color: var(--text-main, #303133);
}

.pollution-count,
.extraction-count{
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary, #606266);
}

.empty-text{
    color: var(--text-light, #909399);
    font-size: 13px;
    padding: 10px 0;
    text-align: center;
}

.rt-detail-card{
    background:
        linear-gradient(
            135deg,
            var(--card-rt-from),
            var(--card-rt-to)
        );
    overflow: visible;
}

.pdf-section{
    page-break-inside: avoid;
    margin-bottom: 20px;
}

@media print{
    .summary-container{
        background: #ffffff !important;
    }
    .pdf-section{
        break-inside: avoid;
    }
}

</style>

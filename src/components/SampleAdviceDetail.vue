<script setup>

import { computed } from 'vue'
import { getTemplateVolumeDisplay, getTargetRNA } from '@/utils/rtHelper'

const props = defineProps({
  sample: {
    type: Object,
    default: () => ({})
  }
})

const analysis = computed(() => props.sample?.analysis || {})
const result = computed(() => props.sample?.result || {})

const analysisPollutionTypes = computed(() => {
  return analysis.value.pollution?.types || []
})

const analysisPollutionDescription = computed(() => {
  return analysis.value.pollution?.description || '未发现明显污染指标异常'
})

const extractionAdvice = computed(() => {
  return analysis.value.advice?.extraction || []
})

const experimentAdvice = computed(() => {
  return analysis.value.advice?.experiment || []
})

// RT数据只从 sample.rt 读取（唯一数据源），禁止从 analysis.rt 读取
const rtTemplateVolume = computed(() => getTemplateVolumeDisplay(props.sample))
const rtStatusText = computed(() => props.sample?.rt?.statusText || '无法计算')
const rtStatusCode = computed(() => props.sample?.rt?.statusCode || '')
const rtTargetRNA = computed(() => getTargetRNA(props.sample))
const rtMaxTemplateVolume = computed(() => props.sample?.rt?.maxTemplateVolume ?? 12)
const rtWaterVolume = computed(() => {
    const wv = props.sample?.rt?.waterVolume;
    if (wv !== null && wv !== undefined) {
        return wv + " μL";
    }
    return "无法配置";
})
const rtSuggestion = computed(() => props.sample?.rt?.suggestion || '')
const rtRequiredConcentration = computed(() => props.sample?.rt?.requiredConcentration)

function getPollutionTagType(type) {
  if (type.includes('严重') || type.includes('异常')) {
    return 'danger'
  }
  if (type.includes('偏低') || type.includes('污染')) {
    return 'warning'
  }
  return 'info'
}

function getRTStatusType(statusCode) {
    switch (statusCode) {
        case 'OK': return 'success'
        case 'OVER_VOLUME': return 'warning'
        case 'NO_CONCENTRATION': return 'info'
        default: return 'info'
    }
}

</script>

<template>

<div class="advice-detail">

  <div class="advice-row">
    <div class="advice-section">
      <h3>污染分析</h3>
      <div v-if="analysisPollutionTypes.length">
        <div
          v-for="(type, idx) in analysisPollutionTypes"
          :key="idx"
          class="pollution-item"
        >
          <el-tag :type="getPollutionTagType(type)">
            {{ type }}
          </el-tag>
        </div>
      </div>
      <div class="pollution-description">
        {{ analysisPollutionDescription }}
      </div>
    </div>

    <div class="advice-section">
      <h3>提取过程建议</h3>
      <div v-if="extractionAdvice.length">
        <div v-for="(item, idx) in extractionAdvice" :key="idx" class="extraction-item">
          <div class="extraction-problem">
            <el-tag type="warning" size="small">{{ item.problem }}</el-tag>
          </div>
          <ul class="extraction-steps">
            <li v-for="(step, sIdx) in item.steps" :key="sIdx">
              {{ step }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="empty-text">
        当前检测指标未发现明显提取污染风险
      </div>
    </div>
  </div>

  <div class="advice-row">
    <div class="advice-section">
      <h3>下游实验建议</h3>
      <div v-if="experimentAdvice">
        <div class="advice-text">{{ experimentAdvice }}</div>
      </div>
      <div v-else class="empty-text">
        RNA质量满足大部分下游实验需求
      </div>
    </div>

    <div class="advice-section">
      <h3>RT体系配置</h3>
      <div class="rt-info">
        <div class="rt-item">
          <span>推荐RNA投入量</span>
          <b>{{ rtTargetRNA }} ng</b>
        </div>
        <div class="rt-item">
          <span>RNA模板体积</span>
          <b :class="{ 'warning-value': rtStatusCode === 'OVER_VOLUME' }">{{ rtTemplateVolume }}</b>
        </div>
        <div class="rt-item">
          <span>最大模板体积</span>
          <b>{{ rtMaxTemplateVolume }} μL</b>
        </div>
        <div class="rt-item">
          <span>RT补水体积</span>
          <b :class="{ 'warning-value': rtStatusCode === 'NO_CONCENTRATION' }">{{ rtWaterVolume }}</b>
        </div>
        <div class="rt-item">
          <span>状态</span>
          <el-tag :type="getRTStatusType(rtStatusCode)" size="small">{{ rtStatusText }}</el-tag>
        </div>
        <div v-if="rtRequiredConcentration" class="rt-item">
          <span>最低需要浓度</span>
          <b>≥ {{ rtRequiredConcentration }} ng/μL</b>
        </div>
      </div>
      <div v-if="rtSuggestion && rtStatusCode !== 'OK'" class="rt-suggestion">
        <el-alert :title="rtSuggestion" type="warning" :closable="false" show-icon />
      </div>
    </div>
  </div>

</div>

</template>

<style scoped>

.advice-detail{
  padding: 16px 20px;
  background: var(--card-bg, #f5f7fa);
  border-radius: 4px;
}

.advice-row{
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 16px;
}

@media (max-width: 768px){
  .advice-row{
    grid-template-columns: 1fr;
  }
}

.advice-section h3{
  margin: 0 0 12px 0;
  font-size: 15px;
  color: var(--text-main, #303133);
  font-weight: 600;
}

.pollution-item{
  display: inline-block;
  margin: 4px 8px 4px 0;
}

.pollution-description{
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
  font-size: 13px;
  color: var(--text-main, #303133);
  line-height: 1.5;
  margin-top: 8px;
}

.advice-list{
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
  margin: 0;
}

.advice-list li{
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-main, #303133);
  margin: 4px 0;
  padding-left: 4px;
}

.extraction-item{
  margin-bottom: 12px;
}

.extraction-problem{
  margin-bottom: 6px;
}

.extraction-steps{
  padding: 6px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
  margin: 0;
}

.extraction-steps li{
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-main, #303133);
  margin: 2px 0;
}

.advice-text{
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
  font-size: 13px;
  color: var(--text-main, #303133);
  line-height: 1.5;
}

.empty-text{
  color: var(--text-light, #909399);
  font-size: 13px;
  padding: 8px 0;
}

.rt-info{
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rt-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border, #e4e7ed);
}

.rt-item:last-child{
  border-bottom: none;
}

.rt-item span{
  font-size: 13px;
  color: var(--text-secondary, #606266);
}

.rt-item b{
  font-size: 14px;
  color: var(--text-main, #303133);
}

.warning-value{
  color: var(--danger-color, #f56c6c) !important;
}

.rt-suggestion{
  margin-top: 10px;
}

.rt-status{
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.rt-volume-info{
  font-size: 13px;
  color: var(--text-main, #303133);
}

.rt-recommendation{
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
  font-size: 13px;
  color: var(--text-main, #303133);
  line-height: 1.5;
}

</style>
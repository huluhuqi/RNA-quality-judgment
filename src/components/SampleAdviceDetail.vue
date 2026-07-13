<script setup>

import { computed } from 'vue'
import { getTemplateVolumeDisplay, getTargetRNA } from '@/utils/rtHelper'
import { getRtStatusStyle } from '@/constants/rtStatusStyle'

const props = defineProps({
  sample: {
    type: Object,
    default: () => ({})
  }
})

const analysis = computed(() => props.sample?.analysis || {})

const analysisPollutionTypes = computed(() => {
  return analysis.value.pollution?.types || []
})

const analysisPollutionDescription = computed(() => {
  return analysis.value.pollution?.description || '未发现明显污染指标异常'
})

const extractionAdvice = computed(() => {
  return analysis.value.advice?.extraction || []
})

const displayExtractionAdvice = computed(() => {
  if (!extractionAdvice.value || extractionAdvice.value.length === 0) {
    return [{ type: "none", problem: "", steps: ["当前样本未发现明显提取流程异常"] }]
  }
  return extractionAdvice.value
})

const experimentAdvice = computed(() => {
  return analysis.value.advice?.experiment || []
})

const rtTemplateVolume = computed(() => getTemplateVolumeDisplay(props.sample))
const rtStatusCode = computed(() => props.sample?.rt?.statusCode || '')
const rtStatusStyle = computed(() => getRtStatusStyle(rtStatusCode.value))
const rtTargetRNA = computed(() => getTargetRNA(props.sample))
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
      <div class="extraction-list">
        <div v-for="(group, idx) in displayExtractionAdvice" :key="idx" class="extraction-group">
          <div v-if="group.problem" class="extraction-group-title">
            <el-tag type="warning" size="small">{{ group.problem }}</el-tag>
          </div>
          <ul class="extraction-steps">
            <li v-for="(step, sIdx) in group.steps" :key="sIdx">
              {{ step }}
            </li>
          </ul>
        </div>
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
      <el-card shadow="hover" class="rt-card">
        <template #header>
          <span class="rt-card-title">RT体系配置</span>
        </template>

        <div class="rt-grid">
          <div class="rt-grid-item">
            <span class="rt-label">RNA投入量</span>
            <strong class="rt-value">{{ rtTargetRNA }} ng</strong>
          </div>
          <div class="rt-grid-item">
            <span class="rt-label">RT模板体积</span>
            <strong
              class="rt-value"
              :class="{ 'warning-value': rtStatusCode === 'OVER_VOLUME' }"
            >{{ rtTemplateVolume }}</strong>
          </div>
          <div class="rt-grid-item">
            <span class="rt-label">RT补水体积</span>
            <strong class="rt-value">{{ rtWaterVolume }}</strong>
          </div>
        </div>

        <div class="rt-status-row">
          <el-tag
            :type="rtStatusStyle.type"
            effect="light"
          >
            {{ rtStatusStyle.icon }} {{ rtStatusStyle.label }}
          </el-tag>
        </div>

        <div v-if="rtRequiredConcentration !== null && rtRequiredConcentration !== undefined && rtStatusCode !== 'OK'" class="rt-concentration">
          最低需要浓度：<b>≥ {{ rtRequiredConcentration }} ng/μL</b>
        </div>

        <div v-if="rtSuggestion && rtStatusCode !== 'OK'" class="rt-suggestion">
          <el-alert
            :title="rtSuggestion"
            type="warning"
            :closable="false"
            show-icon
          />
        </div>
      </el-card>
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
  background: var(--card-bg, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border-color, #e4e7ed);
  font-size: 13px;
  color: var(--text-color, #303133);
  line-height: 1.5;
  margin-top: 8px;
}

.advice-list{
  padding: 8px 12px;
  background: var(--card-bg, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border-color, #e4e7ed);
  margin: 0;
}

.advice-list li{
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-color, #303133);
  margin: 4px 0;
  padding-left: 4px;
}

.extraction-list{
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extraction-group-title{
  margin-bottom: 4px;
}

.extraction-steps{
  padding: 6px 12px;
  background: var(--card-bg, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border-color, #e4e7ed);
  margin: 0;
}

.extraction-steps li{
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-color, #303133);
  margin: 2px 0;
}

.advice-text{
  padding: 8px 12px;
  background: var(--card-bg, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border-color, #e4e7ed);
  font-size: 13px;
  color: var(--text-color, #303133);
  line-height: 1.5;
}

.empty-text{
  color: var(--text-light, #909399);
  font-size: 13px;
  padding: 8px 0;
}

.rt-card{
  height: 100%;
  background: linear-gradient(135deg, var(--card-rt-from), var(--card-rt-to));
}

.rt-card-title{
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color);
}

.rt-grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px 0;
}

.rt-grid-item{
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rt-grid-item .rt-label{
  font-size: 13px;
  color: var(--text-secondary);
}

.rt-grid-item .rt-value{
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
}

.rt-label{
  font-size: 13px;
  color: var(--text-secondary);
}

.rt-value{
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
}

.warning-value{
  color: var(--warning-color, #e6a23c) !important;
}

.rt-status-row{
  padding: 12px 0 0;
  text-align: center;
}

.rt-concentration{
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--card-bg, #ffffff);
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}

.rt-concentration b{
  color: var(--text-color);
}

.rt-suggestion{
  margin-top: 10px;
}

</style>

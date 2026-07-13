<script setup>

import { computed } from 'vue'

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

const rtStatus = computed(() => {
  return analysis.value.rt?.status || ''
})

const rtInputVolume = computed(() => {
  return analysis.value.rt?.inputVolume || null
})

const rtRecommendation = computed(() => {
  return analysis.value.rt?.recommendation || ''
})

function getPollutionTagType(type) {
  if (type.includes('严重') || type.includes('异常')) {
    return 'danger'
  }
  if (type.includes('偏低') || type.includes('污染')) {
    return 'warning'
  }
  return 'info'
}

function getRTTagType(status) {
  switch (status) {
    case '推荐': return 'success'
    case '需要稀释': return 'warning'
    case '浓度不足': return 'danger'
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
      <h3>RT模板推荐</h3>
      <div v-if="rtRecommendation">
        <div class="rt-status">
          <el-tag :type="getRTTagType(rtStatus)" size="small">
            {{ rtStatus }}
          </el-tag>
          <span v-if="rtInputVolume" class="rt-volume-info">
            建议加入: {{ rtInputVolume }} μL
          </span>
        </div>
        <div class="rt-recommendation">
          {{ rtRecommendation }}
        </div>
      </div>
      <div v-else class="empty-text">
        缺少RNA浓度数据，无法计算RT模板量
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
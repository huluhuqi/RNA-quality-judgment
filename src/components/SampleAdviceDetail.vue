<template>

<div class="advice-detail">

  <div class="advice-row">
    <div class="advice-section">
      <h3>污染分析</h3>
      <div v-if="pollution.length">
        <div
          v-for="item in pollution"
          :key="item.type"
          class="pollution-item"
        >
          <el-tag :type="getPollutionTagType(item.level)">
            {{ getPollutionLevelLabel(item.level) }}
          </el-tag>
          <div class="pollution-content">
            <span class="pollution-type">{{ item.type }}</span>
            <span class="pollution-text">{{ item.reason || item.text }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-text">
        暂无明显污染风险
      </div>
    </div>

    <div class="advice-section">
      <h3>提取过程问题分析</h3>
      <div v-if="extractionProblem.length">
        <div
          v-for="(item, idx) in extractionProblem"
          :key="idx"
          class="problem-item"
        >
          <div class="problem-header">
            <el-tag type="warning">{{ item.problem }}</el-tag>
          </div>
          <div class="problem-detail">
            <p><strong>可能步骤：</strong>{{ item.step }}</p>
            <p><strong>优化建议：</strong>{{ item.suggestion }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="extraction.length">
        <el-collapse>
          <el-collapse-item
            v-for="(item, idx) in extraction"
            :key="item.type + idx"
            :title="item.title"
            :name="item.type + idx"
          >
            <div class="collapse-content">
              <p class="section-title">可能原因：</p>
              <ul>
                <li v-for="(cause, i) in item.cause" :key="'c'+i">
                  {{ cause }}
                </li>
              </ul>

              <p class="section-title">可能涉及步骤：</p>
              <ul>
                <li v-for="(step, i) in item.step" :key="'s'+i">
                  {{ step }}
                </li>
              </ul>

              <p class="section-title">优化建议：</p>
              <ul>
                <li v-for="(sol, i) in item.solution" :key="'o'+i">
                  {{ sol }}
                </li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else class="empty-text">
        暂无提取流程异常提示
      </div>
    </div>
  </div>

  <div class="advice-section suggestion-section">
    <h3>后续实验建议</h3>
    <div class="suggestion-text">
      {{ suggestion || '暂无特殊建议' }}
    </div>
  </div>

</div>

</template>

<script setup>

import { computed } from 'vue'

const props = defineProps({
  sample: {
    type: Object,
    default: () => ({})
  }
})

const advice = computed(() => {
  return props.sample?.result?.advice || {}
})

const pollution = computed(() => {
  return advice.value.pollution || []
})

const extraction = computed(() => {
  return advice.value.extraction || []
})

const extractionProblem = computed(() => {
  return advice.value.extractionProblem || []
})

const suggestion = computed(() => {
  return props.sample?.result?.suggestion || ''
})

function getPollutionTagType(level) {
  switch(level) {
    case 'high':
    case '严重':
      return 'danger'
    case 'medium':
    case '轻度':
      return 'warning'
    case 'info':
      return 'info'
    case 'normal':
      return 'success'
    default:
      return 'info'
  }
}

function getPollutionLevelLabel(level) {
  switch(level) {
    case 'high':
      return '高风险'
    case 'medium':
      return '中等'
    case 'info':
      return '提示'
    case 'normal':
      return '正常'
    default:
      return level
  }
}

</script>

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
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
}

.pollution-content{
  flex: 1;
}

.pollution-type{
  display: block;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-main, #303133);
}

.pollution-text{
  font-size: 12px;
  color: var(--text-secondary, #606266);
  line-height: 1.5;
}

.problem-item{
  margin: 8px 0;
  padding: 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
}

.problem-header{
  margin-bottom: 8px;
}

.problem-detail{
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-main, #303133);
}

.problem-detail p{
  margin: 4px 0;
}

.empty-text{
  color: var(--text-light, #909399);
  font-size: 13px;
  padding: 8px 0;
}

.collapse-content{
  font-size: 13px;
  color: var(--text-main, #303133);
  line-height: 1.8;
}

.section-title{
  margin: 8px 0 4px 0;
  font-weight: 600;
  color: var(--text-main, #303133);
}

.collapse-content ul{
  margin: 4px 0 8px 20px;
  padding: 0;
}

.collapse-content li{
  margin: 2px 0;
}

.suggestion-section{
  margin-top: 4px;
}

.suggestion-text{
  padding: 12px 16px;
  background: var(--card-color, #ffffff);
  border-left: 3px solid var(--primary-color, #409EFF);
  border-radius: 0 4px 4px 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-main, #303133);
}

</style>

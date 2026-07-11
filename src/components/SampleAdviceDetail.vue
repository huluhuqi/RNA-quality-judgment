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
          <el-tag :type="item.level === '严重' ? 'danger' : 'warning'">
            {{ item.level }}
          </el-tag>
          <span class="pollution-text">{{ item.text }}</span>
        </div>
      </div>
      <div v-else class="empty-text">
        暂无明显污染风险
      </div>
    </div>

    <div class="advice-section">
      <h3>提取过程问题分析</h3>
      <div v-if="extraction.length">
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
  sample: Object
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

const suggestion = computed(() => {
  return props.sample?.result?.suggestion || ''
})

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
  align-items: center;
  gap: 10px;
  margin: 8px 0;
  padding: 8px 12px;
  background: var(--card-color, #ffffff);
  border-radius: 4px;
  border: 1px solid var(--border, #e4e7ed);
}

.pollution-text{
  font-size: 13px;
  color: var(--text-main, #303133);
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

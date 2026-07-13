<script setup>
/**
 * PDF 总结页组件
 * 
 * 显示实验总体分析和图表
 */
defineProps({
    report: {
        type: Object,
        required: true
    }
});
</script>

<template>
<div class="pdf-summary">
    <h2>总体分析</h2>
    
    <div class="summary-item">
        <span class="label">综合质量：</span>
        <span class="value">{{ report.summary.quality }}</span>
    </div>
    
    <div class="conclusion">
        <h3>分析结论</h3>
        <p>{{ report.summary.conclusion }}</p>
    </div>
    
    <div class="quality-section">
        <h3>质量分布统计</h3>
        <div class="stats-grid">
            <div 
                v-for="(count, key) in report.summary.qualityCount" 
                :key="key"
                class="stat-item"
            >
                <span class="stat-label">{{ key }}</span>
                <span class="stat-value">{{ count }}</span>
            </div>
        </div>
    </div>
    
    <div v-if="report.summary.pollutionCount" class="pollution-section">
        <h3>污染类型统计</h3>
        <div class="stats-grid">
            <div 
                v-for="(count, key) in report.summary.pollutionCount" 
                :key="key"
                class="stat-item"
            >
                <span class="stat-label">{{ key }}</span>
                <span class="stat-value">{{ count }}</span>
            </div>
        </div>
    </div>
    
    <div v-if="report.summary.extractionSummaryText" class="advice-section">
        <h3>提取过程建议</h3>
        <p>{{ report.summary.extractionSummaryText }}</p>
    </div>
</div>
</template>

<style scoped>
.pdf-summary {
    padding: 20px 40px;
}

.pdf-summary h2 {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
}

.summary-item {
    font-size: 14px;
    margin-bottom: 15px;
}

.summary-item .label {
    font-weight: bold;
    color: #303133;
}

.summary-item .value {
    color: #409EFF;
    font-weight: bold;
}

.conclusion, .advice-section {
    margin-top: 20px;
}

.conclusion h3, .advice-section h3 {
    font-size: 14px;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 10px;
}

.conclusion p, .advice-section p {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
}

.quality-section, .pollution-section {
    margin-top: 25px;
}

.quality-section h3, .pollution-section h3 {
    font-size: 14px;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 15px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
}

.stat-item {
    background: #f5f7fa;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 12px;
    color: #606266;
    margin-bottom: 5px;
}

.stat-value {
    display: block;
    font-size: 18px;
    font-weight: bold;
    color: #303133;
}
</style>
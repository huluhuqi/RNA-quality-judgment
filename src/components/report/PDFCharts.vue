<script setup>
/**
 * PDF 图表页组件
 * 
 * 显示质量分布图和污染分析图
 */
defineProps({
    report: {
        type: Object,
        required: true
    }
});
</script>

<template>
<div class="pdf-charts">
    <h2>实验图表</h2>
    
    <div class="chart-container">
        <h3>RNA质量分布</h3>
        <div class="chart-placeholder">
            <span>质量分布图</span>
        </div>
    </div>
    
    <div class="chart-container">
        <h3>污染类型分析</h3>
        <div class="chart-placeholder">
            <span>污染分析图</span>
        </div>
    </div>
</div>
</template>

<style scoped>
.pdf-charts {
    padding: 20px 40px;
}

.pdf-charts h2 {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
}

.chart-container {
    margin-bottom: 30px;
}

.chart-container h3 {
    font-size: 14px;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 15px;
}

.chart-placeholder {
    width: 100%;
    height: 300px;
    background: #f5f7fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-placeholder span {
    color: #909399;
    font-size: 14px;
}
</style>
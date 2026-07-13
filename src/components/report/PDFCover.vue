<script setup>
/**
 * PDF 封面组件
 * 
 * 显示实验报告封面信息
 */
defineProps({
    report: {
        type: Object,
        required: true
    }
});

const now = new Date();
const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
</script>

<template>
<div class="pdf-cover">
    <h1>RNA质量检测实验报告</h1>
    <h2>RNA Quality Detection Report</h2>
    
    <div class="info-section">
        <h3>实验信息</h3>
        <div class="info-item">
            <span class="label">实验名称：</span>
            <span class="value">{{ report.experimentInfo.name || '-' }}</span>
        </div>
        <div class="info-item">
            <span class="label">实验日期：</span>
            <span class="value">{{ report.experimentInfo.date || '-' }}</span>
        </div>
        <div class="info-item">
            <span class="label">操作人员：</span>
            <span class="value">{{ report.experimentInfo.operator || '-' }}</span>
        </div>
        <div class="info-item">
            <span class="label">提取方法：</span>
            <span class="value">{{ report.experimentInfo.extractionMethod || '-' }}</span>
        </div>
        <div class="info-item">
            <span class="label">样本总数：</span>
            <span class="value">{{ report.summary.total }}</span>
        </div>
        <div class="info-item">
            <span class="label">有效样本：</span>
            <span class="value">{{ report.summary.valid }}</span>
        </div>
    </div>
    
    <div class="footer">
        <span>报告生成时间：{{ dateStr }}</span>
    </div>
</div>
</template>

<style scoped>
.pdf-cover {
    padding: 40px;
    text-align: center;
}

.pdf-cover h1 {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
}

.pdf-cover h2 {
    font-size: 16px;
    color: #606266;
    margin-bottom: 40px;
}

.info-section {
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
}

.info-section h3 {
    font-size: 16px;
    font-weight: bold;
    color: #409EFF;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #409EFF;
}

.info-item {
    display: flex;
    margin-bottom: 12px;
}

.info-item .label {
    font-weight: bold;
    color: #303133;
    width: 120px;
    flex-shrink: 0;
}

.info-item .value {
    color: #606266;
}

.footer {
    margin-top: 60px;
    font-size: 12px;
    color: #909399;
}
</style>
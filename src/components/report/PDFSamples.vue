<script setup>
/**
 * PDF 样本数据页组件
 * 
 * 显示完整样本数据列表
 */
defineProps({
    report: {
        type: Object,
        required: true
    }
});
</script>

<template>
<div class="pdf-samples">
    <h2>样本数据列表（共 {{ report.samples.length }} 条）</h2>
    
    <table class="samples-table">
        <thead>
            <tr>
                <th>模板ID</th>
                <th>RNA浓度</th>
                <th>A260/280</th>
                <th>A260/230</th>
                <th>RNA质量</th>
                <th>质量评分</th>
                <th>污染分析</th>
                <th>优化建议</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sample in report.samples" :key="sample.templateId">
                <td>{{ sample.templateId }}</td>
                <td>{{ sample.concentration || '-' }}</td>
                <td>{{ sample.a260280 || '-' }}</td>
                <td>{{ sample.a260230 || '-' }}</td>
                <td>{{ sample.quality }}</td>
                <td>{{ sample.qualityScore || '-' }}</td>
                <td>{{ sample.pollution || '-' }}</td>
                <td>{{ sample.suggestion || '-' }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<style scoped>
.pdf-samples {
    padding: 20px 40px;
}

.pdf-samples h2 {
    font-size: 20px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 20px;
}

.samples-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
}

.samples-table th {
    background: #409EFF;
    color: #ffffff;
    font-weight: bold;
    padding: 10px 8px;
    text-align: left;
    border: 1px solid #e4e7ed;
}

.samples-table td {
    padding: 8px;
    border: 1px solid #e4e7ed;
    color: #606266;
    vertical-align: top;
}

.samples-table tbody tr:nth-child(even) {
    background: #f5f7fa;
}
</style>
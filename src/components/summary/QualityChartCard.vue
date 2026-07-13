<template>
    <el-card shadow="hover" class="chart-card">
        <div class="card-title">RNA质量分布</div>
        <RNAQualityChart ref="chartRef" />
    </el-card>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import RNAQualityChart from '../charts/RNAQualityChart.vue';

const chartRef = ref(null);

defineExpose({
    async getImage() {
        return chartRef.value?.getDataURL({ backgroundColor: '#fff' }) || '';
    }
});
</script>

<style scoped>
.card-title{
    font-size:16px;
    font-weight:600;
    margin-bottom:15px;
}

.chart-card{
    background:
        linear-gradient(
            135deg,
            var(--card-chart-from),
            var(--card-chart-to)
        );
}
</style>
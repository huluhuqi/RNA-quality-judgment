<template>
    <el-card shadow="hover" class="pollution-card">
        <div class="card-title">污染分析</div>
        <PollutionChart ref="chartRef" />
    </el-card>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import PollutionChart from '../charts/PollutionChart.vue';

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

.pollution-card{
    background:
        linear-gradient(
            135deg,
            var(--card-pollution-from),
            var(--card-pollution-to)
        );
    overflow:visible;
}
</style>
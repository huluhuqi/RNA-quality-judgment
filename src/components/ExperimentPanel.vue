<template>
    <el-card class="experiment-panel">
        <template #header>
            <span>实验管理</span>
        </template>

        <div class="panel-grid">
            <div class="section-card">
                <h3>RNA提取信息</h3>
                <el-form label-width="100px" :model="form.extraction">
                    <el-form-item label="提取方法">
                        <el-select v-model="form.extraction.method" @change="onChange">
                            <el-option
                                v-for="method in extractionMethods"
                                :key="method.value"
                                :label="method.label"
                                :value="method.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="样本类型">
                        <el-input v-model="form.extraction.source" @change="onChange" />
                    </el-form-item>
                    <el-form-item label="试剂盒">
                        <el-input v-model="form.extraction.kit" @change="onChange" />
                    </el-form-item>
                </el-form>
            </div>

            <div class="section-card">
                <h3>下游实验用途</h3>
                <el-form label-width="100px" :model="form.application">
                    <el-form-item label="实验目的">
                        <el-select v-model="form.application.purpose" @change="onChange">
                            <el-option
                                v-for="app in applications"
                                :key="app.value"
                                :label="app.label"
                                :value="app.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="灵敏度要求">
                        <el-select v-model="form.application.sensitivity" @change="onChange">
                            <el-option label="普通" value="normal" />
                            <el-option label="高灵敏度" value="high" />
                            <el-option label="超高灵敏度" value="ultra" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>

            <div class="section-card">
                <h3>RT参数</h3>
                <el-form label-width="100px" :model="form.rt">
                    <el-form-item label="体系体积">
                        <el-input-number
                            v-model="form.rt.systemVolume"
                            :min="10"
                            :max="100"
                            :step="1"
                            @change="onChange"
                        />
                        <span class="unit">μL</span>
                    </el-form-item>
                    <el-form-item label="逆转录酶">
                        <el-input v-model="form.rt.enzyme" @change="onChange" />
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="action-area">
            <el-button type="danger" @click="emit('clear')">清空实验</el-button>
            <el-button type="primary" @click="emit('new')">新增样本</el-button>
        </div>
    </el-card>
</template>

<script setup>
import { reactive } from 'vue';
import { extractionMethods } from '@/config/extractionMethods';
import { applications } from '@/config/applications';

const emit = defineEmits(['change', 'new', 'clear']);

const form = reactive({
    extraction: {
        method: 'column',
        kit: '',
        source: ''
    },
    application: {
        purpose: 'qpcr',
        sensitivity: 'normal'
    },
    rt: {
        enzyme: '',
        systemVolume: 20
    }
});

function onChange() {
    emit('change', { ...form });
}
</script>

<style scoped>
.experiment-panel {
    background: linear-gradient(135deg, #f0f9ff, #ffffff);
}

.panel-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;
}

@media (max-width: 1200px) {
    .panel-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .panel-grid {
        grid-template-columns: 1fr;
    }
}

.section-card {
    background: var(--card-bg, #ffffff);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid var(--border-color, #e4e7ed);
}

.section-card h3 {
    margin: 0 0 12px 0;
    font-size: 15px;
    color: var(--text-main, #303133);
    font-weight: 600;
    border-bottom: 1px solid var(--border-color, #e4e7ed);
    padding-bottom: 8px;
}

.unit {
    margin-left: 8px;
    color: var(--text-secondary, #606266);
}

.action-area {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 8px;
}
</style>
<template>


<el-card class="export-card">


<template #header>

<span>
报告导出
</span>

</template>


<el-button
type="success"
@click="excel"
>
导出Excel
</el-button>


<el-button
type="primary"
@click="pdf"
>
导出PDF
</el-button>


</el-card>


</template>


<script setup>

import { useSampleStore } from '../store/sampleStore';
import { useExperimentStore } from '../store/experimentStore';
import { createExportData } from '../export/exportAdapter';
import { exportExcel } from '../export/excel/excelExporter';
import { exportPDF } from '../export/pdf/pdfExporter';
import { validateExport } from '../export/exportValidator';
import { startExport, endExport } from '../export/exportLock';
import { ElMessage } from 'element-plus';

const sampleStore = useSampleStore();
const experimentStore = useExperimentStore();

const props = defineProps({
    summary:{
        type:Object,
        default:()=>({})
    },
    settings:{
        type:Object,
        default:()=>({})
    },
    summaryRef:{
        type:Object,
        default:null
    }
});


async function excel(){

    if (!startExport()) {
        ElMessage.warning('正在导出中，请稍后再试');
        return;
    }

    try {
        validateExport(sampleStore.samples);

        let charts = {quality:null, pollution:null, extraction:null}

        if(props.summaryRef?.getCharts){
            charts = await props.summaryRef.getCharts()
        }

        const experiment = {
            extraction: {
                method: experimentStore.extraction.method,
                source: experimentStore.extraction.source
            },
            application: {
                purpose: experimentStore.application.purpose
            }
        };

        const data = createExportData(sampleStore.samples, experiment);
        data.summary = props.summary;

        exportExcel(data);
    } catch (e) {
        ElMessage.error(e.message);
    } finally {
        endExport();
    }

}


async function pdf(){

    if (!startExport()) {
        ElMessage.warning('正在导出中，请稍后再试');
        return;
    }

    try {
        validateExport(sampleStore.samples);

        let charts = {quality:null, pollution:null}

        if(props.summaryRef?.getCharts){
            charts = await props.summaryRef.getCharts()
        }

        const experiment = {
            extraction: {
                method: experimentStore.extraction.method,
                source: experimentStore.extraction.source
            },
            application: {
                purpose: experimentStore.application.purpose
            }
        };

        const data = createExportData(sampleStore.samples, experiment);
        data.summary = props.summary;

        exportPDF(data, charts);
    } catch (e) {
        ElMessage.error('PDF生成失败，请检查数据完整性');
        console.error(e);
    } finally {
        endExport();
    }

}


</script>


<style scoped>

.export-card{

    background:
        linear-gradient(
            135deg,
            #f7fff5,
            #ffffff
        );

}

</style>
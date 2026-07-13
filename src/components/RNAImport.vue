<script setup>
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { createSample } from "@/models/SampleModel";

const emit = defineEmits(["import"]);

const fields = [
    { label: "模板ID", value: "templateId" },
    { label: "RNA浓度", value: "concentration" },
    { label: "A260/A280", value: "a260280" },
    { label: "A260/A230", value: "a260230" }
];

const columns = ref([
    "templateId",
    "concentration",
    "a260280",
    "a260230"
]);

const inputs = ref(["", "", "", ""]);

function options(index) {
    const used = columns.value.filter((_, i) => i !== index);
    return fields.filter(item => !used.includes(item.value));
}

function generateID(index) {
    const d = new Date();
    const dateStr = (
        d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0")
    );
    return `${dateStr}-${String(index + 1).padStart(3, "0")}`;
}

function parseLines(text) {
    return text
        .split(/\r?\n/)
        .map(v => v.trim())
        .filter(v => v !== "");
}

function importData() {
    const parsedLines = inputs.value.map(text => parseLines(text));
    const length = Math.max(...parsedLines.map(x => x.length), 0);

    if (length === 0) {
        ElMessage.warning("请输入RNA数据");
        return;
    }

    const result = [];

    for (let i = 0; i < length; i++) {
        const raw = {};

        columns.value.forEach((field, index) => {
            raw[field] = parsedLines[index][i] || null;
        });

        const sample = createSample({
            raw: {
                templateId: raw.templateId || generateID(i),
                concentration: raw.concentration !== null && raw.concentration !== "" ? Number(raw.concentration) : null,
                a260280: raw.a260280 !== null && raw.a260280 !== "" ? Number(raw.a260280) : null,
                a260230: raw.a260230 !== null && raw.a260230 !== "" ? Number(raw.a260230) : null
            }
        });

        result.push(sample);
    }

    emit("import", result);
    ElMessage.success(`成功导入${result.length}个样本`);
}

function clearData() {
    inputs.value = ["", "", "", ""];
}
</script>

<template>
    <div class="rna-import">
        <div class="input-grid">
            <div
                v-for="(item, index) in columns"
                :key="index"
                class="input-box"
            >
                <el-select
                    v-model="columns[index]"
                    size="default"
                    class="field-select"
                >
                    <el-option
                        v-for="f in options(index)"
                        :key="f.value"
                        :label="f.label"
                        :value="f.value"
                    />
                </el-select>

                <el-input
                    v-model="inputs[index]"
                    type="textarea"
                    :rows="8"
                    :placeholder="`粘贴${fields.find(f => f.value === columns[index])?.label || '数据'}，每行一个`"
                />
            </div>
        </div>

        <div class="button-area">
            <el-button
                type="primary"
                @click="importData"
            >
                导入数据
            </el-button>

            <el-button
                @click="clearData"
            >
                清空数据
            </el-button>
        </div>
    </div>
</template>

<style scoped>
.rna-import{
    width: 100%;
}

.input-grid{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;
}

.input-box{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-select{
    width: 100%;
}

.button-area{
    display: flex;
    gap: 12px;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
}

@media(max-width: 1200px){
    .input-grid{
        grid-template-columns: repeat(2, 1fr);
    }
}

@media(max-width: 600px){
    .input-grid{
        grid-template-columns: 1fr;
    }
}
</style>
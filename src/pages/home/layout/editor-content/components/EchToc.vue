<template>
    <a-typography class="he-toc">
        <a-descriptions :column="1">
            <a-descriptions-item label="创建时间">
                {{ createTime }}
            </a-descriptions-item>
            <a-descriptions-item label="更新时间">
                {{ updateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="字符数" v-if="length > -1">
                {{ length }}
            </a-descriptions-item>
            <a-descriptions-item label="行数" v-if="lines > -1">
                {{ lines }}
            </a-descriptions-item>
        </a-descriptions>
        <div v-for="item in toc" :key="item.id">
            <a-link :style="{marginLeft: (item.level * 15) + 'px'}" v-html="item.text" @click.stop="toToc(item.id)"/>
        </div>
    </a-typography>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {getLineLength, getTextCount, getToc} from "@/store/components/HomeEditorStore";

const emits = defineEmits(['hide']);

function toToc(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView();
    }
    emits('hide');
}

const createTime = computed(() => '');
const updateTime = computed(() => '');

const length = getTextCount.value();
const lines = getLineLength.value();
const toc = getToc.value();

</script>
<style scoped>
.he-toc {
    width: 250px;
    max-height: 70vh;
    overflow: auto;
    background-color: var(--color-neutral-3);
    color: var(--color-text-1);
    padding: 21px 14px 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>

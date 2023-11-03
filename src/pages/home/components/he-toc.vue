<template>
    <a-typography class="he-toc">
        <a-descriptions :column="1">
            <a-descriptions-item label="创建时间">
                {{ toDateString(props.index.createTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="更新时间">
                {{ toDateString(props.index.updateTime) }}
            </a-descriptions-item>
            <a-descriptions-item label="字符数" v-if="props.length > -1">
                {{ props.length }}
            </a-descriptions-item>
            <a-descriptions-item label="行数" v-if="props.line > -1">
                {{ props.line }}
            </a-descriptions-item>
        </a-descriptions>
        <a-divider v-if="props.toc?.length > 0"/>
        <div v-for="item in props.toc" :key="item.id">
            <a-link :style="{marginLeft: (item.level * 15) + 'px'}" v-html="item.text" @click.stop="toToc(item.id)"/>
        </div>
    </a-typography>
</template>
<script lang="ts" setup>
import {PropType} from "vue";
import {TocItem} from "@/components/markdown-editor/common/TocItem";
import {ArticleIndex, getDefaultArticleIndex} from "@/entity/article";
import {toDateString} from "xe-utils";

const props = defineProps({
    index: {
        type: Object as PropType<ArticleIndex>,
        default: getDefaultArticleIndex()
    },
    toc: {
        type: Object as PropType<Array<TocItem>>,
        default: new Array<TocItem>()
    },
    length: {
        type: Number,
        default: -1
    },
    line: {
        type: Number,
        default: -1
    }
});
const emits = defineEmits(['hide']);

function toToc(id: string) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView();
    }
    emits('hide');
}

</script>
<style scoped>
.he-toc {
    width: 250px;
    max-height: 70vh;
    overflow: auto;
    background-color: var(--color-neutral-3);
    color: var(--color-text-1);
    padding: 21px 14px 7px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>

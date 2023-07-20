<template>
    <a-list-item action-layout="vertical">
        <a-list-item-meta :description="item.description">
            <template #title>
                <a-link @click="jumpTo()">{{ item.name }}</a-link>
            </template>
        </a-list-item-meta>
        <template #actions>
            <a-tag color="orange">
                <template #icon>
                    <icon-clock-circle/>
                </template>
                {{ toDateString(item.createTime) }}
            </a-tag>
            <a-tag v-for="tag in item.tags" style="margin-right: 7px;" :color="randomColor(tag)">
                {{ tag }}
            </a-tag>
        </template>
        <template #extra>
            <span>{{ item.source }}</span>
            <a-dropdown trigger="click" position="br">
                <a-button type="text" style="margin-left: 14px;">
                    <template #icon>
                        <icon-more-vertical/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="switchFeature()">
                        <template #icon>
                            <icon-heart-fill v-if="collect"/>
                            <icon-heart v-else/>
                        </template>
                        {{ collect ? '取消收藏' : '添加收藏' }}
                    </a-doption>
                    <a-doption @click="editTo()">
                        <template #icon>
                            <icon-edit/>
                        </template>
                        编辑
                    </a-doption>
                    <a-doption @click="removeBy()">
                        <template #icon>
                            <icon-delete/>
                        </template>
                        删除
                    </a-doption>
                </template>
            </a-dropdown>
        </template>
    </a-list-item>
</template>
<script lang="ts" setup>
import {randomColor} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";
import {useRouter} from "vue-router";
import {computed, PropType, ref} from "vue";
import {ArticleIndex} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {statistics} from "@/global/BeanFactory";

const props = defineProps({
    article: Object as PropType<ArticleIndex>
});
const emits = defineEmits(['remove']);

const router = useRouter();
const item = ref({
    id: 0,
    createTime: new Date(),
    updateTime: new Date(),
    name: '',
    categoryId: 0,
    tags: [],
    source: '',
    description: ''
});
const feature = ref<any | undefined>(undefined);
const collect = computed(() => typeof feature.value !== 'undefined');

item.value = Object.assign(item.value, props.article);

feature.value = utools.getFeatures(['/article/' + item.value.id])[0]

function jumpTo() {
    router.push('/article/' + item.value.id);
}

function editTo() {
    router.push('/editor/' + item.value.id);
}

function removeBy() {
    MessageBoxUtil.confirm(`你确定删除文章【${item.value.name}】，删除后将无法恢复`,
        "删除警告", {
            confirmButtonText: "删除",
            cancelButtonText: "取消"
        })
        .then(() => useArticleStore()
            .removeById(item.value.id)
            .then(() => {
                MessageUtil.success("删除成功");
                emits('remove');
            })
            .catch(e => MessageUtil.error("删除成功", e)));
}

function switchFeature() {
    if (feature.value) {
        removeFeature()
    } else {
        addFeature();
    }
}

function addFeature() {
    statistics.access("固定文章")
    let record = {
        code: '/article/' + item.value.id,
        explain: "知识库 - 文章",
        icon: "public/logo.png",
        cmds: [item.value.name],
        platform: ['darwin', 'win32', 'linux'] as Array<'darwin' | 'win32' | 'linux'>
    };
    utools.setFeature(record);
    feature.value = record;
}

function removeFeature() {
    utools.removeFeature('/article/' + item.value.id);
    feature.value = undefined;
}

</script>
<style scoped>

</style>

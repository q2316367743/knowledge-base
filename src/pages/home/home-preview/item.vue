<template>
    <a-card hoverable class="home-item">
        <div class="header">
            <div class="title">
                <a-link @click="jumpTo()">
                    {{ item.name }}
                </a-link>
            </div>
            <div class="extra">
                <a-dropdown trigger="click" position="br">
                    <a-button type="text">
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
            </div>
        </div>
        <div class="desc">
            {{ item.description }}
        </div>
        <div class="tags">
            <a-tag color="orange">
                <template #icon>
                    <icon-clock-circle/>
                </template>
                {{ toDateString(item.createTime) }}
            </a-tag>
            <a-tag v-for="tag in item.tags" style="margin-left: 7px;cursor: pointer;" :color="randomColor(tag)"
                   @click="emits('use-tag', tag)">
                {{ tag }}
            </a-tag>
        </div>
        <div class="more-tips-wrap" v-if="item.source != '' || base.sourceUrl !== ''" @click="toSource()"
             :style="{cursor: base.sourceUrl !== '' ? 'pointer' : ''}">
            <a-tooltip :content="item.source || base.sourceUrl" position="right">
                <div class="more-tips"></div>
            </a-tooltip>
        </div>
    </a-card>
</template>
<script lang="ts" setup>
import {randomColor} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";
import {useRouter} from "vue-router";
import {computed, PropType, ref, watch} from "vue";
import {ArticleBase, ArticleIndex, getDefaultArticleBase} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {statistics} from "@/global/BeanFactory";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const props = defineProps({
    article: Object as PropType<ArticleIndex>
});
const emits = defineEmits(['remove', 'use-tag']);

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
const base = ref<ArticleBase>(getDefaultArticleBase())
const feature = ref<any | undefined>(undefined);
const collect = computed(() => typeof feature.value !== 'undefined');

item.value = Object.assign(item.value, props.article);
if (item.value.id !== 0) {
    utools.db.promises.get(LocalNameEnum.ARTICLE_BASE + item.value.id)
            .then(res => {
                if (res) {
                    base.value = Object.assign(base.value, res.value);
                }
            })
}

watch(() => item.value, value => {
    item.value = Object.assign(item.value, value);
    if (item.value.id !== 0) {
        utools.db.promises.get(LocalNameEnum.ARTICLE_BASE + value.id)
                .then(res => {
                    if (res) {
                        base.value = Object.assign(base.value, res.value);
                    }
                })
    }
})

feature.value = utools.getFeatures(['article:' + item.value.id])[0];

function toSource() {
    if (base.value.sourceUrl) {
        utools.shellOpenExternal(base.value.sourceUrl);
    }
}

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
        code: 'article:' + item.value.id,
        explain: "知识库 - 文章",
        icon: "public/logo.png",
        cmds: [item.value.name],
        platform: ['darwin', 'win32', 'linux'] as Array<'darwin' | 'win32' | 'linux'>
    };
    utools.setFeature(record);
    feature.value = record;
}

function removeFeature() {
    utools.removeFeature('article:' + item.value.id);
    feature.value = undefined;
}

</script>
<style lang="less">
.home-item {
    margin: 4px 0 7px 0;

    &:first-child {
        margin-top: 0;
    }

    &:last-child {
        margin-bottom: 0;
    }

    .arco-badge {
        width: 100%;

    }

    .header {
        display: grid;
        grid-template-columns: 1fr 32px;

        .title {
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
            height: 32px;
            line-height: 32px;
        }

        width: 100%;
    }

    .desc {
        font-size: 0.9em;
        color: var(--color-neutral-6);
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        margin-top: 7px;
    }

    .more-tips-wrap {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        left: 0;

        .more-tips {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border: 5px solid;
            border-color: rgb(var(--arcoblue-4)) transparent transparent rgb(var(--arcoblue-4));
            border-radius: 2px;
        }
    }
}
</style>

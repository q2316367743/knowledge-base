<template>
    <div class="graph-search">
        <header class="header">
            <a-row :gutter="8" class="search">
                <a-col flex="120px">
                    <a-select v-model="type" style="width: 120px">
                        <a-option :value="0">全部</a-option>
                        <a-option v-for="articleType in articleTextTypes" :key="articleType.key"
                                  :value="articleType.key">
                            {{ articleType.name }}
                        </a-option>
                    </a-select>
                </a-col>
                <a-col flex="auto">
                    <a-input-search v-model="keyword" :placeholder="SearchContentPlaceholder" allow-clear
                                    :loading="loading"
                                    search-button @search="searchContent()" @clear="searchContent()"
                                    @keydown.enter="searchContent"/>
                </a-col>
                <a-col flex="32px">
                    <a-button type="primary" status="danger" :disabled="!loading" @click="stop()">
                        <template #icon>
                            <icon-close/>
                        </template>
                    </a-button>
                </a-col>
            </a-row>
        </header>
        <main class="container">
            <a-alert v-if="loading">{{ text }}</a-alert>
            <a-list :bordered="false" :virtual-list-props="{height: maxHeight}" :data="items">
                <template #item="{item}">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                <a-tag color="blue">{{ renderArticleType(item.type) }}</a-tag>
                                <a-tooltip content="打开预览">
                                    <a-link @click="openArticle(item.value)">{{ item.title }}</a-link>
                                </a-tooltip>
                            </template>
                            <template #description>
                                <span v-html="item.html"></span>
                            </template>
                        </a-list-item-meta>
                        <template #actions>
                            <a-tooltip content="跳转到编辑器">
                                <a-button type="text" @click="jumpToArticle(item.value)">
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </template>
                    </a-list-item>
                </template>
            </a-list>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {useWindowSize} from "@vueuse/core";
import {computed, onBeforeUnmount, ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useRouter} from "vue-router";
import {_searchContent, SearchContentItem, SearchContentPlaceholder} from "@/pages/home/components/SearchContent";
import {articleTextTypes, renderArticleType} from "@/pages/home/components/he-context";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {openArticle} from "@/components/ArticePreview/OpenArticle";


const size = useWindowSize();
const router = useRouter();

const keyword = ref('');
const loading = ref(false);
const close = ref(false);
const text = ref('');
const items = ref(new Array<SearchContentItem>())
const type = ref<ArticleTypeEnum | 0>(0)

const maxHeight = computed(() => size.height.value - 56);

function searchContent() {
    loading.value = true;
    close.value = false;
    text.value = '';
    items.value = [];
    if (keyword.value.trim() === '') {
        loading.value = false;
        close.value = true;
        return;
    }
    _searchContent(keyword.value, close, items, text, type.value)
        .then(() => MessageUtil.success("搜索完成"))
        .catch(e => MessageUtil.error("搜索失败", e))
        .finally(() => loading.value = false);

}


onBeforeUnmount(() => close.value = true);

function stop() {
    if (close.value) {
        MessageUtil.warning("正在停止中，请勿重复操作");
        return;
    }
    close.value = true;
}

function jumpToArticle(id: number) {
    useHomeEditorStore().openArticle(id);
    router.push('/home')
}

</script>
<style scoped lang="less">
.graph-search {
    .header {
        padding: 8px 16px;
    }

}
</style>

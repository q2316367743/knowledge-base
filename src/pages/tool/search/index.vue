<template>
    <div class="graph-search">
        <header class="header">
            <a-input-group class="search" :style="{width: searchWidth + 'px'}">
                <a-input-search v-model="keyword" :placeholder="SearchContentPlaceholder" allow-clear :loading="loading"
                                search-button @search="searchContent()" @clear="searchContent()"/>
                <a-button type="primary" status="danger" :disabled="!loading" @click="stop()">
                    <template #icon>
                        <icon-close/>
                    </template>
                </a-button>
            </a-input-group>
        </header>
        <main class="container">
            <a-alert v-if="loading">{{ text }}</a-alert>
            <a-list :bordered="false">
                <a-list-item v-for="item in items">
                    <a-list-item-meta>
                        <template #title>
                            <a-link @click="toArticle(item.value)">{{item.title}}</a-link>
                        </template>
                        <template #description>
                            <span v-html="item.html"></span>
                        </template>
                    </a-list-item-meta>
                </a-list-item>
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


const size = useWindowSize();
const router = useRouter();

const keyword = ref('');
const loading = ref(false);
const close = ref(false);
const text = ref('');
const items = ref(new Array<SearchContentItem>())

const searchWidth = computed(() => size.width.value / 2);

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
    _searchContent(keyword.value, close, items, text)
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

function toArticle(id: number) {
    useHomeEditorStore().openArticle(id);
    router.push('/home')

}

</script>
<style scoped lang="less">
.graph-search {
    .header {
        display: flex;
        justify-content: center;
        padding: 14px 0;
    }

    .container {
        position: absolute;
        top: 67px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        overflow: auto;
    }
}
</style>

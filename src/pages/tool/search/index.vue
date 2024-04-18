<template>
    <div class="graph-search">
        <header class="header">
            <a-input-group class="search" :style="{width: searchWidth + 'px'}">
                <a-input-search v-model="keyword" placeholder="请输入关键内容" allow-clear :loading="loading"
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
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleContent} from "@/entity/article/ArticleContent";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useRouter} from "vue-router";

interface Item {
    title: string;
    html: string;
    value: number
}

const size = useWindowSize();
const router = useRouter();

const keyword = ref('');
const loading = ref(false);
const close = ref(false);
const text = ref('');
const items = ref(new Array<Item>())

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
    _searchContent()
        .then(() => MessageUtil.success("搜索完成"))
        .catch(e => MessageUtil.error("搜索失败", e))
        .finally(() => loading.value = false);

}

async function _searchContent() {
    const articles = useArticleStore().articles.filter(a =>
        (a.type === ArticleTypeEnum.RICH_TEXT || a.type === ArticleTypeEnum.MARKDOWN || a.type === ArticleTypeEnum.CODE));
    for (let i = 0; i < articles.length; i++) {
        if (close.value) {
            return Promise.resolve();
        }
        text.value = `正在搜索 ${i + 1} / ${articles.length}`
        const article = articles[i];
        const contentWrap = await getFromOneWithDefaultByAsync<ArticleContent<any>>(
            LocalNameEnum.ARTICLE_CONTENT + article.id, {content: ''});
        // 搜索
        let content = contentWrap.record.content;
        if (typeof content !== 'string') {
            continue;
        }
        if (article.type === ArticleTypeEnum.RICH_TEXT) {
            const parser = new DOMParser();
            const document = parser.parseFromString(content, 'text/html');
            content = document.body.innerText;
        }
        const length = content.length;
        const index = content.indexOf(keyword.value);
        if (index > -1) {
            const prefix = content.substring(Math.max(0, index - 30), index);
            const key = content.substring(index, Math.min(length, index + keyword.value.length));
            const suffix = content.substring(Math.max(0, index + keyword.value.length),
                Math.min(length, index + keyword.value.length + 80));
            items.value.push({
                html: `${prefix}<mark class="keyword">${key}</mark>${suffix}`,
                title: article.name,
                value: article.id
            });
        }
    }

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

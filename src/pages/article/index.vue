<template>
    <a-layout class="article">
        <article-header :name="article.name" :collapsed="collapsed" @switch-collapsed="switchCollapsed()"
                        @download="downloadFile"/>
        <a-layout :style="{height: height}">
            <a-layout-content>
                <div class="container" id="article-container">
                    <a-scrollbar style="height:100%;overflow: auto;" type="track">
                        <article class="info" :class="articleTheme" id="article-container-content">
                            <article-info :value="article" :base="base" v-if="!loading"/>
                            <a-typography class="content" v-html="preview"></a-typography>
                        </article>
                        <article-comment :id="articleId" v-if="articleId !== 0"/>
                        <a-result status="404" title="加载中" v-if="loading"></a-result>
                    </a-scrollbar>
                </div>
            </a-layout-content>
            <a-layout-sider :collapsed="collapsed" :width="width" :collapsed-width="0">
                <div ref="previewEle" class="toc"/>
            </a-layout-sider>
            <a-back-top target-container=".article .arco-scrollbar-container"/>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onMounted, ref} from "vue";
import {parseInt} from "lodash-es";
import html2canvas from "html2canvas";
import MessageUtil from "@/utils/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {ArticleBase, ArticleIndex, ArticlePreview, ArticleSource} from "@/entity/article";
// 枚举
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 存储
import {useSettingStore} from "@/store/db/SettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
// 组件
import ArticleHeader from './components/header.vue';
import ArticleComment from './components/comment.vue';
import ArticleInfo from "@/pages/article/components/info.vue";
import createBlogDirectory from "@/components/RenderToc/render";
// 主题
import {onAfterRender, renderTemplate} from "@/pages/article/func";
import './index.less';
import './theme/zui.less';
import './theme/heti.less';
import './theme/juejin.less';
import './theme/tailwind-blue.css';
import './theme/channing-cyan.css';
import './theme/chinese-red.css';
import './theme/condensed-night-purple.css';
import './theme/devui-blue.css';
import './theme/geek-black.css';
import './theme/jzman.css';
import './theme/smart-blue.css';
import './theme/v-green.css';
import './theme/vuepress.css';


const route = useRoute();
const router = useRouter();
const article = ref<ArticleIndex>({
    id: 0,
    name: '',
    description: '',
    categoryId: null,
    tags: [],
    createTime: '',
    updateTime: '',
    source: ''
});
const base = ref<ArticleBase>({
    sourceUrl: ''
})
const articleId = ref(0);
const preview = ref('');
const loading = ref(true);
const articleTheme = computed(() => useSettingStore().articleTheme);
const collapsed = ref(true);
const width = computed(() => useGlobalStore().width / 4);
const height = computed(() => (useGlobalStore().height - 36) + 'px');

const previewEle = ref<HTMLDivElement>();

function switchCollapsed() {
    collapsed.value = !collapsed.value;
}

onMounted(() => {
    init().then(() => loading.value = false)
        .catch(e => {
            MessageUtil.error("文章渲染失败", e);
            router.push("/home");
        })
});

async function init() {
    const id = route.params.id as string;
    if (!id) {
        return Promise.reject("ID不存在");
    }
    const articleIndex = useArticleStore().articleMap.get(parseInt(id));
    if (!articleIndex) {
        return Promise.reject(`文章【${id}】不存在`);
    }
    articleId.value = parseInt(id);
    article.value = articleIndex;
    // 获取基础信息
    const res = await utools.db.promises.get(LocalNameEnum.ARTICLE_BASE + id)
    if (res) {
        base.value = Object.assign(base.value, res.value);
    }
    const previewWrap = await utools.db.promises.get(LocalNameEnum.ARTICLE_PREVIEW + id)
    if (previewWrap) {
        preview.value = (previewWrap.value as ArticlePreview).html;
        await nextTick(() => {
            onAfterRender();
            createBlogDirectory("article-container-content", 20, previewEle.value as HTMLDivElement);
        });
    }
}

function downloadFile(type: 'image' | 'md' | 'html' | 'pdf') {
    switch (type) {
        case 'image':
            toImage();
            break;
        case 'md':
            toMd();
            break;
        case 'html':
            toHtml();
            break;
        case 'pdf':
            toPdf();
            break;
    }
}

function toImage() {
    useGlobalStore().startLoading("开始导出");
    try {
        html2canvas(document.getElementById("article-container-content")!, {
            backgroundColor: useGlobalStore().isDark ? '#000000' : '#ffffff'
        }).then(res => {
            res.toBlob(blob => {
                if (blob) {
                    download(blob, article.value.name + ".png", "image/png");
                }
            })
        }).finally(() => useGlobalStore().closeLoading());
    } catch (e) {
        console.error(e);
        useGlobalStore().closeLoading();
    }
}

function toMd() {
    useGlobalStore().startLoading("开始导出");
    utools.db.promises.get(LocalNameEnum.ARTICLE_CONTENT + articleId.value)
        .then(res => {
            if (res) {
                const source = res.value as ArticleSource;
                download(source.content, article.value.name + ".md", "text/markdown");
            }
        })
        .catch(e => MessageUtil.error("数据导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

function toHtml() {
    useGlobalStore().startLoading("开始导出");
    try {
        const ele = document.getElementById("article-container-content");
        if (ele) {
            download(renderTemplate(article.value.name, ele.outerHTML),
                article.value.name + ".html",
                "text/html");
        }
    } catch (e) {
        MessageUtil.error("数据导出失败", e);
    } finally {
        useGlobalStore().closeLoading()
    }
}


function toPdf() {
    MessageUtil.warning("暂不支持");
}

</script>
<style lang="less">
</style>

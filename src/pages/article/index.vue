<template>
    <a-layout class="article">
        <article-header :name="article.name" :collapsed="collapsed" @switch-collapsed="switchCollapsed()"
                        @download="downloadFile" @to-editor="toEditor($event)" @set-mark="setMark"/>
        <a-layout :style="{height: height}">
            <!-- 内容 -->
            <a-layout-content>
                <div class="container" id="article-container">
                    <a-scrollbar style="height:100%;overflow: auto;" type="track">
                        <!-- 实际内容 -->
                        <article class="info" :class="articleTheme" id="article-container-content-wrap">
                            <!-- 文章信息 -->
                            <article-info :value="article" :base="base" v-if="!loading && articleHeaderVisible"/>
                            <!-- 文章内容 -->
                            <a-typography class="content" v-html="preview" :class="codeWrap ? 'need-wrap' : ''"
                                          id="article-container-content"></a-typography>
                        </article>
                        <!-- 评论 -->
                        <article-comment :id="articleId" v-if="articleId !== 0"/>
                        <a-result status="404" title="加载中" v-if="loading"></a-result>
                    </a-scrollbar>
                </div>
            </a-layout-content>
            <!-- 目录 -->
            <a-layout-sider :collapsed="collapsed" :width="width" :collapsed-width="0">
                <div ref="previewEle" class="toc"/>
            </a-layout-sider>
            <a-back-top target-container=".article .arco-scrollbar-container"/>
        </a-layout>
        <article-search/>
    </a-layout>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {computed, nextTick, onMounted, onUnmounted, ref} from "vue";
import {parseInt} from "lodash-es";
import html2canvas from "html2canvas";
import Highlighter from 'web-highlighter';
import HighlightSource from "web-highlighter/src/model/source";
import tippy from 'tippy.js'
import MessageUtil from "@/utils/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {
    ArticleBase,
    ArticleIndex,
    ArticlePreview,
    ArticleSource,
    getDefaultArticleBase,
    getDefaultArticleIndex
} from "@/entity/article";
// 枚举
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 存储
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useAuthStore} from "@/store/components/AuthStore";
// 组件
import ArticleHeader from './components/header.vue';
import ArticleComment from './components/comment.vue';
import ArticleSearch from './components/search.vue';
import ArticleInfo from "@/pages/article/components/info.vue";
// 主题
import createBlogDirectory from "@/components/RenderToc/render";
import {onAfterRender, renderTemplate} from "@/pages/article/func";
import './index.less';
import 'tippy.js/dist/tippy.css';
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";

const props = defineProps({
    id: String
});

let id = '';
let marks = new Array<HighlightSource>();
let markRev = undefined as string | undefined;
const router = useRouter();
const article = ref<ArticleIndex>(getDefaultArticleIndex());
const base = ref<ArticleBase>(getDefaultArticleBase())
const articleId = ref(0);
const preview = ref('');
const loading = ref(true);
const collapsed = ref(true);
const width = computed(() => useGlobalStore().width / 4);
const height = computed(() => (useGlobalStore().height - 36) + 'px');

const articleHeaderVisible = ref(useBaseSettingStore().articleHeaderVisible);
const articleTheme = ref(useBaseSettingStore().articleTheme);
const codeWrap = ref(useBaseSettingStore().codeWrap);

const previewEle = ref<HTMLDivElement>();

function switchCollapsed() {
    collapsed.value = !collapsed.value;
}

onMounted(() => {
    // 从路由和props中获取
    useGlobalStore().startLoading("开始获取文章内容")
    init(props.id as string)
        .then(() => {
            loading.value = false;
            // 设置
            if (base.value.customer) {
                articleHeaderVisible.value = base.value.articleHeaderVisible;
                articleTheme.value = base.value.articleTheme;
                codeWrap.value = base.value.codeWrap;
            }
        })
        .catch(e => {
            MessageUtil.error("文章渲染失败", e);
            router.push("/home");
        })
        .finally(() => useGlobalStore().closeLoading());
});

const urls = new Array<string>();

async function init(articleIdStr: string) {
    console.log(articleIdStr)
    id = articleIdStr;
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
    const res = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_BASE + id)
    if (res) {
        base.value = Object.assign(base.value, res.value);
    }
    const previewWrap = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_PREVIEW + id)
    if (previewWrap) {
        preview.value = (previewWrap.value as ArticlePreview).html;
        await nextTick(() => {
            onAfterRender(url => urls.push(url));
            createBlogDirectory("article-container-content-wrap", 20, previewEle.value as HTMLDivElement);
            renderMark();
        });
    }
}

// 释放资源
onUnmounted(() => {
    // 释放资源
    urls.forEach(url => window.URL.revokeObjectURL(url));
    // 移除子输入框
    utools.removeSubInput();
});

function toEditor(isEmbed: boolean) {
    if (isEmbed) {
        // 编辑器模式
        useArticleStore().setPreview(parseInt(id), false)
            .then(() => MessageUtil.success("切换为编辑模式"))
            .catch(e => MessageUtil.error("切换为编辑模式失败", e));
    } else {
        router.push('/editor/' + id);
    }
}

// =======================================================================
// --------------------------------- 标记 ---------------------------------
// =======================================================================


let markLock = false;
let highlighter: Highlighter;

function setMark(isMark: boolean) {
    if (highlighter) {
        if (isMark) {
            highlighter.run();
        } else {
            highlighter.stop();
        }
    }
}

async function renderMark() {
    highlighter = new Highlighter({
        $root: document.getElementById("article-container-content") as HTMLDivElement,
        exceptSelectors: ['pre', 'code']
    });
    // 1. 实例化
    const res = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_MARK + id)
    if (res) {
        // 存在
        marks = res.value as any[];
        markRev = res._rev;
    }
    for (let mark of marks) {
        highlighter.fromStore(mark.startMeta, mark.endMeta, mark.id, mark.text);
    }
    highlighter
        .on(Highlighter.event.CLICK, ({id}) => {
            highlighter.remove(id);
        })
        .on(Highlighter.event.CREATE, ({sources}) => saveMark(highlighter, sources))
        .on(Highlighter.event.REMOVE, ({ids}) => removeMark(ids));


    tippy('.highlight-mengshou-wrap', {
        content: '删除'
    })
}

function saveMark(highlighter: Highlighter, templateMarks: HighlightSource[]) {
    if (markLock) {
        return;
    }
    markLock = true;
    // 新的模板
    templateMarks.forEach(mark => {
        marks.push(mark);
    })
    tippy('.highlight-mengshou-wrap', {
        content: '删除'
    })
    // 更新数据
    useAuthStore().authDriver.put({
        _id: LocalNameEnum.ARTICLE_MARK + id,
        _rev: markRev,
        value: marks
    }).then(res => {
        if (res.error) {
            MessageUtil.error("新增标记异常", res.message);
        }
        markRev = res.rev;
    }).catch(e => MessageUtil.error("新增标记错误", e))
        .finally(() => markLock = false);
}

function removeMark(ids: string[]) {
    if (markLock) {
        return;
    }
    markLock = true;
    for (let target of ids) {
        const index = marks.findIndex(e => e.text === target);
        if (index != -1) {
            marks.splice(index, 1);
        }
    }
    // 更新数据
    useAuthStore().authDriver.put({
        _id: LocalNameEnum.ARTICLE_MARK + id,
        _rev: markRev,
        value: marks
    }).then(res => {
        if (res.error) {
            MessageUtil.error("删除标记异常", res.message);
        }
        markRev = res.rev;
    }).catch(e => MessageUtil.error("删除标记错误", e))
        .finally(() => markLock = false);

}

// ===========================================================================
// --------------------------------- 文件下载 ---------------------------------
// ===========================================================================

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
        html2canvas(document.getElementById("article-container-content-wrap")!, {
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
    useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_CONTENT + articleId.value)
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
        const ele = document.getElementById("article-container-content-wrap");
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
    window.print();
    MessageUtil.warning("暂不支持");
}

</script>
<style lang="less">
</style>

<template>
    <a-layout class="article">
        <article-header :name="article.name" :collapsed="collapsed" @switch-collapsed="switchCollapsed()"/>
        <a-layout>
            <a-layout-content>
                <div class="container" id="article-container">
                    <a-scrollbar style="height:100%;overflow: auto;" type="track">
                        <article class="info" :class="articleTheme" id="article-container-content">
                            <article-info :value="article" v-if="!loading"/>
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
import MessageUtil from "@/utils/MessageUtil";
import {ArticleIndex, ArticlePreview} from "@/entity/article";

// 枚举
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 存储
import {useArticleInfoStore} from "@/store/component/ArticleInfoStore";
import {useSettingStore} from "@/store/db/SettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";
// 组件
import ArticleHeader from './components/header.vue';
import ArticleComment from './components/comment.vue';
// 主题
import {onAfterRender} from "@/pages/article/func";
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
import ArticleInfo from "@/pages/article/components/info.vue";
import {useGlobalStore} from "@/store/GlobalStore";
import createBlogDirectory from "@/components/RenderToc/render";


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
const articleId = ref(0);
const preview = ref('');
const loading = ref(true);
const articleTheme = computed(() => useSettingStore().articleTheme);
const collapsed = ref(true);
const width = computed(() => useGlobalStore().width / 4);

const previewEle = ref<HTMLDivElement>();

function switchCollapsed() {
    collapsed.value = !collapsed.value;
}

onMounted(() => {
    const id = route.params.id as string;
    if (!id) {
        MessageUtil.error("ID不存在");
        router.push("/home");
        return;
    }
    const articleIndex = useArticleStore().articleMap.get(parseInt(id));
    if (!articleIndex) {
        MessageUtil.error(`文章【${id}】不存在`);
        router.push("/home");
        return;
    }
    useArticleInfoStore().init(articleIndex.id, articleIndex.name);
    articleId.value = parseInt(id);
    article.value = articleIndex;
    // 获取预览
    loading.value = false
    utools.db.promises.get(LocalNameEnum.ARTICLE_PREVIEW + id)
            .then(res => {
                if (res) {
                    preview.value = (res.value as ArticlePreview).html;
                    nextTick(() => {
                        onAfterRender();
                        createBlogDirectory("article-container-content", 20, previewEle.value as HTMLDivElement);
                    });
                }
            }).catch(e => MessageUtil.error("获取文章内容失败", e));
});

</script>
<style lang="less">
</style>

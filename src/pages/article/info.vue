<template>
    <article class="info" :class="articleTheme">
        <header v-if="articleHeaderVisible">
            <blockquote>
                <ul>
                    <li v-if="article.source.trim() !== ''"><b>来源：</b>{{ article.source }}</li>
                    <li><b>创建时间：</b>{{ toDate(article.createTime) }}</li>
                    <li><b>更新时间：</b>{{ toDate(article.updateTime) }}</li>
                    <li v-if="article.tags.length > 0"><b>标签：</b>
                        <a-tag v-for="tag in article.tags" :color="randomColor()" style="margin-right: 7px;">{{
                                tag
                            }}
                        </a-tag>
                    </li>
                    <li v-if="article.description.trim() !== ''"><b>摘要：</b>{{ article.description }}</li>
                </ul>
            </blockquote>
        </header>
        <section class="content" v-html="preview"></section>
    </article>
    <a-result status="404" title="加载中" v-if="loading"></a-result>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {parseInt} from "lodash-es";
import {toDateString} from "xe-utils";
import MessageUtil from "@/utils/MessageUtil";
import {randomColor} from "@/utils/BrowserUtil";
import {ArticleIndex, ArticlePreview} from "@/entity/article";

// 枚举
import LocalNameEnum from "@/enumeration/LocalNameEnum";
// 存储
import {useArticleInfoStore} from "@/store/component/ArticleInfoStore";
import {useSettingStore} from "@/store/db/SettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";

// 主题
import {onAfterRender} from "@/pages/article/func";
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
const preview = ref('');
const loading = ref(true)
const articleTheme = computed(() => useSettingStore().articleTheme);
const articleHeaderVisible = computed(() => useSettingStore().articleHeaderVisible);

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
    useArticleInfoStore().init(articleIndex.id, articleIndex.name)
    article.value = articleIndex;
    // 获取预览
    utools.db.promises.get(LocalNameEnum.ARTICLE_PREVIEW + id)
            .then(res => {
                if (res) {
                    preview.value = (res.value as ArticlePreview).html;
                }
            }).catch(e => MessageUtil.error("获取文章内容失败", e));
});

watch(() => preview.value, preview => {
    if (preview) {
        nextTick(() => onAfterRender());
    }
});

function toDate(date: Date | string): string {
    if (date === '') {
        return '';
    }
    return toDateString(date, "yyyy年MM月dd日 HH:mm:ss")
}

</script>
<style>
.info {
    margin: 14px;
}
</style>

<template>
    <theme-zui :article="article" :preview="preview" v-if="articleTheme === ArticleThemeEnum.ZUI"/>
    <theme-he-ti :article="article" :preview="preview" v-if="articleTheme === ArticleThemeEnum.HE_TI"/>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {parseInt} from "lodash-es";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleIndex, ArticlePreview} from "@/entity/article";

// 枚举
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

import {useArticleInfoStore} from "@/store/component/ArticleInfoStore";
import {useSettingStore} from "@/store/db/SettingStore";

// 主题
import ThemeZui from './theme/zui.vue'
import ThemeHeTi from './theme/heti.vue'


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
const articleTheme = computed(() => useSettingStore().articleTheme);

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
})


</script>
<style>

</style>

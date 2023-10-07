<template>
    <div class="editor">
        <!-- 头部 -->
        <div class="header">
            <div class="left" :style="{width: width - 32 * 2 - 4 * 7 + 'px'}">
                <a-button type="text" @click="toHome()">
                    <template #icon>
                        <icon-left/>
                    </template>
                </a-button>
                <a-input v-model="title" placeholder="请输入文章标题" allow-clear :style="{marginLeft: '7px', width: width - 3 * 32 - 4 * 7 + 'px'}"/>
            </div>
            <a-button-group type="primary">
                <a-button @click="save()" style="margin-right: 7px">
                    <template #icon>
                        <icon-save />
                    </template>
                </a-button>
                <a-button @click="extra.visible = true">
                    <template #icon>
                        <icon-settings/>
                    </template>
                </a-button>
            </a-button-group>
        </div>
        <!-- 编辑区 -->
        <div class="container">
            <markdown-editor v-model="content"/>
        </div>
        <!-- 额外信息 -->
        <a-drawer v-model:visible="extra.visible" title="信息" :width="300" :footer="false">
            <a-form :model="extra" layout="vertical">
                <a-form-item label="来源">
                    <a-input v-model="extra.source" :max-length="32"/>
                    <template #help>
                        最大32个字
                    </template>
                </a-form-item>
                <a-form-item label="来源链接">
                    <a-input v-model="base.sourceUrl" :max-length="255"/>
                </a-form-item>
                <a-form-item label="分类">
                    <a-tree-select :data="categoryTree" v-model="extra.categoryId" placeholder="请选择分类" >
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="标签">
                    <a-select v-model="extra.tags" placeholder="请输入标签" multiple scrollbar allow-clear allow-search
                              allow-create>
                        <a-option v-for="tag in articleTags" :value="tag">{{ tag }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="描述">
                    <a-textarea v-model="extra.description" :auto-size="{minRows: 4}"
                                placeholder="请输入描述，不能超过64个字"
                                allow-clear :max-length="64" show-word-limit/>
                </a-form-item>
                <a-divider>额外信息</a-divider>
                <a-form-item label="自定义设置">
                    <a-switch v-model="base.customer" />
                </a-form-item>
                <a-form-item v-if="base.customer" label="文章主题">
                    <a-select v-model="base.articleTheme" style="width: 200px">
                        <a-option :value="ArticleThemeEnum.TAILWIND_BLUE">天空蓝</a-option>
                        <a-option :value="ArticleThemeEnum.JUE_JIN">掘金</a-option>
                        <a-option :value="ArticleThemeEnum.CHANNING_CYAN">柠青</a-option>
                        <a-option :value="ArticleThemeEnum.CHINESE_RED">中国红</a-option>
                        <a-option :value="ArticleThemeEnum.CONDENSED_NIGHT_PURPLE">凝夜紫</a-option>
                        <a-option :value="ArticleThemeEnum.DEVUI_BLUE">科技蓝</a-option>
                        <a-option :value="ArticleThemeEnum.GEEK_BLACK">极客黑</a-option>
                        <a-option :value="ArticleThemeEnum.JZMAN">jzman</a-option>
                        <a-option :value="ArticleThemeEnum.SMART_BLUE">灵动蓝</a-option>
                        <a-option :value="ArticleThemeEnum.V_GREEN">微绿</a-option>
                        <a-option :value="ArticleThemeEnum.VUEPRESS">vuepress</a-option>
                        <a-option :value="ArticleThemeEnum.HE_TI">赫蹏</a-option>
                        <a-option :value="ArticleThemeEnum.GITHUB">Github</a-option>
                        <a-option :value="ArticleThemeEnum.ZUI">Zui</a-option>
                    </a-select>
                    <template #help>
                        <span v-html="renderHelp(base.articleTheme)"></span>
                    </template>
                </a-form-item>
                <a-form-item v-if="base.customer" label="文章头部是否显示">
                    <a-switch v-model="base.articleHeaderVisible"/>
                </a-form-item>
                <a-form-item v-if="base.customer" label="代码是否换行">
                    <a-switch v-model="base.codeWrap">
                        <template #checked>换行</template>
                        <template #unchecked>滚动</template>
                    </a-switch>
                </a-form-item>
            </a-form>
        </a-drawer>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import MessageUtil from "@/utils/MessageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleSource, getDefaultArticleBaseByBaseSetting} from "@/entity/article";
import MarkdownEditor from "@/components/markdown-editor/index.vue";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import {renderHelp} from "@/store/db/BaseSettingStore";
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/store/components/AuthStore";

const route = useRoute();
const router = useRouter();

const id = ref(0);
const title = ref('');
const content = ref('');
const base = ref(getDefaultArticleBaseByBaseSetting());
const extra = ref({
    visible: false,
    tags: new Array<string>(),
    categoryId: undefined as number | undefined,
    description: '',
    createTime: '' as Date | string,
    source: ''
});

const width = computed(() => useGlobalStore().width);
const isDark = computed(() => useGlobalStore().isDark);
const articleTags = computed(() => useArticleStore().articleTags);
const categoryTree = computed(() => useCategoryStore().categoryTree);


init()
    .then(() => {
        const extra = sessionStorage.getItem('extra');
        sessionStorage.removeItem('extra');
        if (extra) {
            content.value = extra;
        }
    });

async function init() {
    const articleId = route.params.id as string;
    if (articleId !== '0') {
        id.value = parseInt(articleId);
        const articleIndex = useArticleStore().articleMap.get(id.value);
        if (!articleIndex) {
            MessageUtil.error(`文章【${id.value}】未找到，请刷新后重试！`);
            return;
        }
        extra.value = {
            visible: false,
            tags: articleIndex.tags,
            categoryId: articleIndex.categoryId || undefined,
            description: articleIndex.description,
            createTime: articleIndex.createTime,
            source: articleIndex.source
        }
        title.value = articleIndex.name;
        // 基础信息
        const baseWrap = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_BASE + id.value);
        if (baseWrap) {
            base.value = Object.assign(base.value, baseWrap.value);
        }
        // 内容
        const contentWrap = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_CONTENT + id.value);
        if (contentWrap) {
            content.value = (contentWrap.value as ArticleSource).content;
        }
    }
}
function toHome() {
    router.back();
}
function save() {
    if (id.value === 0) {
        useArticleStore().add({
            name: title.value,
            description: extra.value.description,
            tags: extra.value.tags,
            categoryId: extra.value.categoryId || null,
            source: extra.value.source,
            folder: 0,
            preview: false
        }, base.value, content.value)
            .then(idWrap => {
                id.value = idWrap;
                MessageUtil.success("保存文章成功");
                router.push("/home");
            })
            .catch(e => MessageUtil.error("保存文章失败", e));
    } else {
        useArticleStore().update(id.value, {
            name: title.value,
            description: extra.value.description,
            tags: extra.value.tags,
            categoryId: extra.value.categoryId || null,
            source: extra.value.source,
            createTime: extra.value.createTime
        }, base.value,content.value)
            .then(() => {
                MessageUtil.success("保存文章成功");
                router.push("/home");
            })
            .catch(e => MessageUtil.error("保存文章失败", e));
    }
}

</script>
<style lang="less">
@import url(./index.less);
</style>

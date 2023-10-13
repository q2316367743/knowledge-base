<template>
    <div class="he-editor">
        <!-- 头部 -->
        <header class="header">
            <div class="left">
                <a-button type="text" @click="switchCollapsed()">
                    <template #icon>
                        <icon-menu/>
                    </template>
                </a-button>
                <a-input v-model="title" placeholder="请输入文章标题" allow-clear :disabled="articleIndex.preview" style="margin-left: 7px;"/>
            </div>
            <a-button-group type="text">
                <a-space>
                    <a-button @click="setPreview()" :loadin="saveLoading">
                        <template #icon>
                            <icon-edit v-if="articleIndex.preview"/>
                            <icon-lock v-else/>
                        </template>
                    </a-button>
                    <a-dropdown position="br">
                        <a-button>
                            <template #icon>
                                <icon-more/>
                            </template>
                        </a-button>
                        <template #content>
                            <a-doption @click="save()">
                                <template #icon>
                                    <icon-save/>
                                </template>
                                保存
                            </a-doption>
                            <a-dsubmenu disabled>
                                <template #icon>
                                    <icon-send/>
                                </template>
                                发布到
                                <template #content>
                                    <a-doption @click="sendTo(OneSendType.JUEJIN)">稀土掘金</a-doption>
                                    <a-doption>CSDN</a-doption>
                                    <a-doption>博客园</a-doption>
                                </template>
                            </a-dsubmenu>
                            <a-doption @click="extraVisible = true">
                                <template #icon>
                                    <icon-settings/>
                                </template>
                                设置
                            </a-doption>
                        </template>
                    </a-dropdown>
                </a-space>
            </a-button-group>
        </header>
        <!-- 编辑区 -->
        <div class="ec-container">
            <markdown-editor v-model="content" :preview="articleIndex.preview"/>
        </div>
        <!-- 额外信息 -->
        <a-drawer v-model:visible="extraVisible" title="信息" :width="300" ok-text="保存" @ok="save()">
            <a-form :model="articleIndex" layout="vertical">
                <a-form-item label="来源">
                    <a-input v-model="articleIndex.source" :max-length="32"/>
                    <template #help>
                        最大32个字
                    </template>
                </a-form-item>
                <a-form-item label="来源链接">
                    <a-input v-model="base.sourceUrl" :max-length="255"/>
                </a-form-item>
                <a-form-item label="分类">
                    <a-tree-select :data="categoryTree" v-model="articleIndex.categoryId" placeholder="请选择分类">
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="标签">
                    <a-select v-model="articleIndex.tags" placeholder="请输入标签" multiple scrollbar allow-clear
                              allow-search
                              allow-create>
                        <a-option v-for="tag in articleTags" :value="tag">{{ tag }}</a-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="描述">
                    <a-textarea v-model="articleIndex.description" :auto-size="{minRows: 4}"
                                placeholder="请输入描述，不能超过64个字"
                                allow-clear :max-length="64" show-word-limit/>
                </a-form-item>
                <a-divider>额外信息</a-divider>
                <a-form-item label="自定义设置">
                    <a-switch v-model="base.customer"/>
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
import {computed, ref, watch} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleSource, getDefaultArticleBaseByBaseSetting, getDefaultArticleIndex} from "@/entity/article";
import MarkdownEditor from "@/components/markdown-editor/index.vue";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import {renderHelp} from "@/store/db/BaseSettingStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useAuthStore} from "@/store/components/AuthStore";
import {useMagicKeys} from "@vueuse/core";
import {getOneSend, OneSendType} from "@/components/one-send/OneSend";


const {ctrl, s} = useMagicKeys()

const title = ref('');
const content = ref('');
const base = ref(getDefaultArticleBaseByBaseSetting());
const extraVisible = ref(false);
const saveLoading = ref(false);
const articleIndex = ref(getDefaultArticleIndex());

const id = computed(() => useHomeEditorStore().id);
const width = computed(() => useGlobalStore().width);
const isDark = computed(() => useGlobalStore().isDark);
const articleTags = computed(() => useArticleStore().articleTags);
const categoryTree = computed(() => useCategoryStore().categoryTree);

watch(() => id.value, value => init(value));

init(id.value);

function init(articleId: number) {
    if (articleId === 0) {
        // 清空数据
        clear()
        return;
    }
    useGlobalStore().startLoading("正在获取文章内容");
    _init(articleId)
        .catch(e => MessageUtil.error("获取内容失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

async function _init(articleId: number) {
    const articleIndexWrap = useArticleStore().articleMap.get(id.value);
    if (!articleIndexWrap) {
        MessageUtil.error(`文章【${articleId}】未找到，请刷新后重试！`);
        return;
    }
    articleIndex.value = articleIndexWrap;
    extraVisible.value = false;
    title.value = articleIndexWrap.name;
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

const switchCollapsed = () => useHomeEditorStore().switchCollapsed();
const setPreview = () => useArticleStore().setPreview(id.value, !articleIndex.value.preview)
    .then(() => {
        if (articleIndex.value.preview) {
            MessageUtil.success("切换为编辑模式");
        } else {
            MessageUtil.success("切换为预览模式");
        }
        articleIndex.value.preview = !articleIndex.value.preview;
    })
    .catch(e => MessageUtil.error("切换为预览模式失败", e));

function save() {
    saveLoading.value = true;
    if (id.value === 0) {
        useArticleStore().add({
            name: title.value,
            description: articleIndex.value.description,
            tags: articleIndex.value.tags,
            categoryId: articleIndex.value.categoryId,
            source: articleIndex.value.source,
            folder: 0,
            preview: false
        }, base.value, content.value)
            .then(idWrap => {
                useHomeEditorStore().setId(idWrap);
                MessageUtil.success("保存文章成功");
            })
            .catch(e => MessageUtil.error("保存文章失败", e))
            .finally(() => saveLoading.value = false);
    } else {
        useArticleStore().update(id.value, {
            name: title.value,
            description: articleIndex.value.description,
            tags: articleIndex.value.tags,
            categoryId: articleIndex.value.categoryId,
            source: articleIndex.value.source,
        }, base.value, content.value)
            .then(() => {
                MessageUtil.success("保存文章成功");
            })
            .catch(e => MessageUtil.error("保存文章失败", e))
            .finally(() => saveLoading.value = false);
    }
}


watch(() => s.value, value => {
    if (value && ctrl.value) {
        save();
    }
});

function clear() {
    // 清空数据
    title.value = '';
    content.value = '';
    base.value = getDefaultArticleBaseByBaseSetting();
    articleIndex.value = getDefaultArticleIndex();
    extraVisible.value = false;
}

let lock = false;
let todo = false;

function autoSave() {
    if (id.value === 0) {
        return;
    }
    if (lock) {
        todo = true;
        return;
    }
    lock = true;
    saveLoading.value = true;
    useArticleStore().update(id.value, {
        name: title.value,
        description: articleIndex.value.description,
        tags: articleIndex.value.tags,
        categoryId: articleIndex.value.categoryId,
        source: articleIndex.value.source,
    }, base.value, content.value)
        .then(() => {
            lock = false;
            if (todo) {
                todo = false;
                // 存在待办，再次执行
                autoSave();
            }
        })
        .catch(e => MessageUtil.error("保存文章失败", e))
        .finally(() => saveLoading.value = false);
}

watch(() => content.value, () => autoSave());
watch(() => title.value, () => autoSave());

function sendTo(type: OneSendType) {
    try {
        getOneSend(type).send(useHomeEditorStore().id);
    } catch (e) {
        MessageUtil.error("发送失败", e);
    }
}

</script>
<style lang="less">
.he-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .header {
        padding: 4px 7px;
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
            width: 70%;
        }
    }

    .ec-container {
        position: absolute;
        top: 43px;
        left: 7px;
        right: 7px;
        bottom: 7px;

    }
}
</style>

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
                <a-input v-model="title" placeholder="请输入文章标题" allow-clear :disabled="articleIndex.preview"
                         style="margin-left: 7px;"/>
            </div>
            <a-button-group type="text">
                <a-space>
                    <a-trigger trigger="hover" position="br" @popup-visible-change="renderToc($event)">
                        <a-button type="text">
                            <template #icon>
                                <icon-info-circle/>
                            </template>
                        </a-button>
                        <template #content>
                            <he-toc :index="articleIndex" :toc="tocItems" :length="length" :line="line"/>
                        </template>
                    </a-trigger>
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
                            <a-doption @click="extraVisible = true" :disabled="articleIndex.preview">
                                <template #icon>
                                    <icon-settings/>
                                </template>
                                设置
                            </a-doption>
                            <a-dsubmenu v-if="articleIndex.preview"
                                        :disabled="articleIndex.type !== ArticleTypeEnum.MARKDOWN">
                                <template #icon>
                                    <icon-export/>
                                </template>
                                导出
                                <template #content>
                                    <a-doption @click="exportFile('md')">markdown文件</a-doption>
                                    <a-doption @click="exportFile('pdf')">pdf文件</a-doption>
                                    <a-doption @click="exportFile('img')">图片</a-doption>
                                </template>
                            </a-dsubmenu>
                        </template>
                    </a-dropdown>
                </a-space>
            </a-button-group>
        </header>
        <!-- 编辑区 -->
        <div class="ec-container">
            <markdown-editor v-model="content" :preview="articleIndex.preview" ref="mdEditor"
                             v-if="articleIndex.type === ArticleTypeEnum.MARKDOWN && editorVisible"/>
            <editor-js v-model="content" :read-only="articleIndex.preview"
                       v-else-if="articleIndex.type === ArticleTypeEnum.RICH_TEXT && editorVisible"/>
            <monaco-editor v-model="content" :language="language" :read-only="articleIndex.preview"
                           v-else-if="articleIndex.type === ArticleTypeEnum.CODE && editorVisible"/>
        </div>
        <he-base v-model="extraVisible"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useMagicKeys} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleSource, getDefaultArticleBaseByBaseSetting, getDefaultArticleIndex} from "@/entity/article";
// 编辑器
import MarkdownEditor from "@/components/markdown-editor/index.vue";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import EditorJs from '@/components/editor-js/index.vue';
// 状态存储
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useAuthStore} from "@/store/components/AuthStore";
// 工具类
import {parseFileExtra} from "@/utils/FileUtil";
import {download} from "@/utils/BrowserUtil";
// 组件
import HeBase from "@/pages/home/components/he-base.vue";
import {getOneSend, OneSendType} from "@/components/one-send/OneSend";
// 枚举
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import HeToc from "@/pages/home/components/he-toc.vue";
import {TocItem} from "@/components/markdown-editor/common/TocItem";

const {ctrl, s} = useMagicKeys()

const title = ref('');
const content = ref('');
let contentRev: string | undefined = undefined;
const saveLoading = ref(false);
const articleIndex = ref(getDefaultArticleIndex());
const mdEditor = ref<any | null>(null);
const extraVisible = ref(false);
const editorVisible = ref(false);

// 目录数据
const tocItems = ref(new Array<TocItem>());
const length = ref(0);
const line = ref(0);

const id = computed(() => useHomeEditorStore().id);
const language = computed(() => parseFileExtra(title.value));

watch(() => id.value, value => init(value));

init(id.value);

function init(articleId: number) {
    // 清空数据
    clear()
    if (articleId === 0) {
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
    articleIndex.value = getDefaultArticleIndex(articleIndexWrap);
    title.value = articleIndexWrap.name;
    // 内容
    editorVisible.value = false;
    try {
        const contentWrap = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE_CONTENT + id.value);
        if (contentWrap) {
            content.value = (contentWrap.value as ArticleSource).content;
            contentRev = contentWrap._rev;
        }
    } catch (e) {
        MessageUtil.error("内容获取失败", e);
    } finally {
        editorVisible.value = true;
    }
}

const switchCollapsed = () => useHomeEditorStore().switchCollapsed();
const setPreview = () => useArticleStore().updateIndex(id.value, {preview: !articleIndex.value.preview})
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
        useArticleStore().add(getDefaultArticleIndex({
            name: title.value,
        }), getDefaultArticleBaseByBaseSetting(), content.value)
            .then(idWrap => {
                useHomeEditorStore().setId(idWrap);
                MessageUtil.success("保存文章成功");
            })
            .catch(e => MessageUtil.error("保存文章失败", e))
            .finally(() => saveLoading.value = false);
    } else {
        useArticleStore().updateContent(id.value, {
            name: title.value,
        }, content.value, contentRev)
            .then(rev => {
                MessageUtil.success("保存文章成功");
                contentRev = rev;
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
    articleIndex.value = getDefaultArticleIndex();
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
    useArticleStore().updateContent(id.value, {
        name: title.value,
    }, content.value, contentRev)
        .then(rev => {
            contentRev = rev;
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

function exportFile(type: 'pdf' | 'img' | 'md') {
    if (type === 'md') {
        download(content.value, title.value + '.md', 'text/markdown;charset=utf-8');
    } else {
        if (mdEditor.value) {
            mdEditor.value.exportFile(type, title.value + (type === 'pdf' ? '.pdf' : '.png'));
        }
    }
}

function renderToc(visible: boolean) {
    if (visible) {
        if (mdEditor.value) {
            tocItems.value = mdEditor.value.getToc();
        } else {
            tocItems.value = [];
        }
        if (articleIndex.value.type !== ArticleTypeEnum.RICH_TEXT) {
            length.value = content.value.length;
            line.value = content.value.split('\n').length;
        } else {
            length.value = -1;
            line.value = -1;
        }
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

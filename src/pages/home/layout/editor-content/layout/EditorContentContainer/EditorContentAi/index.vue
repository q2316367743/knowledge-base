<template>
    <div class="editor-content-ai"
         :style="{position: fullscreen ? 'fixed' : 'absolute', backgroundColor: fullscreen ? 'var(--color-bg-1)' : ''}">
        <header class="header">
            <a-tabs hide-content v-model:active-key="activeKey" type="text">
                <a-tab-pane title="聊天" key="1" :disabled="loading"/>
                <a-tab-pane title="你问我答" key="2" :disabled="loading || !allowAsk"/>
                <template #extra>
                    <a-button type="text" @click="toggle()">
                        <icon-fullscreen-exit v-if="fullscreen"/>
                        <icon-fullscreen v-else/>
                    </a-button>
                </template>
            </a-tabs>
        </header>
        <main class="main" v-show="activeKey === '1'">
            <div class="container" ref="containerRef">
                <a-row v-for="message in ai.chat.messages">
                    <a-col :span="20">
                        <a-typography class="message">
                            <div class="message-user">
                                {{ renderRole(message.role) }}
                            </div>
                            <a-typography-paragraph class="message-content preview" v-html="renderContent(message.content)">
                            </a-typography-paragraph>
                            <div class="message-tool">
                                <a-button-group type="text" v-if="message.role !== 'system'">
                                    <a-button @click="execCopy(message.content)">
                                        <template #icon>
                                            <icon-copy/>
                                        </template>
                                    </a-button>
                                    <a-tooltip content="插入到文章中" :disabled="!allowInsert">
                                        <a-button :disabled="!allowInsert" @click="insertToArticle(message.content)">
                                            <template #icon>
                                                <icon-left/>
                                            </template>
                                        </a-button>
                                    </a-tooltip>
                                </a-button-group>
                            </div>
                        </a-typography>
                    </a-col>
                </a-row>
                <a-row v-if="loading">
                    <a-col :span="20">
                        <div class="message">
                            <div class="message-user">
                                AI小助手
                            </div>
                            <div class="message-content">
                                正在思考中
                                <icon-refresh spin/>
                            </div>
                            <div class="message-tool"></div>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="input">
                <a-input-group>
                    <a-tooltip content="清空聊天记录">
                        <a-button type="text" status="danger" :loading="loading" @click="clearChat()">
                            <template #icon>
                                <icon-delete/>
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-input placeholder="聊点什么吧..." allow-clear v-model="content" :disabled="loading"
                             @keydown.enter="sendChat()"/>
                    <a-button type="text" @click="sendChat()" :loading="loading">
                        <template #icon>
                            <icon-send/>
                        </template>
                    </a-button>
                </a-input-group>
            </div>
        </main>
        <main class="main" v-show="activeKey === '2'">
            <a-typography class="container">
                <a-alert type="warning" closable v-if="showWarn">此操作会将文章内容附带提交
                    <template #action>
                        <a-button size="small" type="text" @click="closeWarn()">不再提示</a-button>
                    </template>
                </a-alert>
                <a-typography-paragraph class="question" v-if="ai.ask.question">{{ ai.ask.question }}</a-typography-paragraph>
                <div class="answer" v-if="loading">正在回答中 <icon-refresh spin /></div>
                <a-typography-paragraph class="answer preview" v-else v-html="renderContent(ai.ask.answer)"></a-typography-paragraph>
            </a-typography>
            <div class="input">
                <a-input-group>
                    <a-button type="text" :loading="loading" :disabled="!allowInsert" @click="openAiAskPromptDrawer()">
                        <template #icon>
                            <icon-settings/>
                        </template>
                    </a-button>
                    <a-auto-complete placeholder="对于这篇文章，你有什么想问的？" allow-clear v-model="question" :data="prompts"
                             :disabled="loading" @keydown.enter="sendToAsk()">
                    </a-auto-complete>
                    <a-button type="text" @click="sendToAsk()" :loading="loading" :disabled="!allowInsert">
                        <template #icon>
                            <icon-send/>
                        </template>
                    </a-button>
                </a-input-group>
            </div>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, PropType, ref, watch} from "vue";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {editorType} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {ArticleIndex} from "@/entity/article";
import {execCopy, renderContent, renderRole} from "./func";
import {ArticleAi, getDefaultArticleAi} from "@/entity/article/ArticleAi";
import {getFromOneByAsync, getItemByDefault, saveOneByAsync, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {htmlToMarkdown, mindMapToMarkdown, stringToBlob} from "@/utils/file/ConvertUtil";
import {openAiAskPromptDrawer, useAiAskPromptStore} from "@/store/components/AiAskPromptStore";

const props = defineProps({
    articleIndex: Object as PropType<ArticleIndex>
});
const emits = defineEmits(['insertToArticle']);
defineExpose({sendToChat});


const showWarn = ref(getItemByDefault(LocalNameEnum.KEY_ARTICLE_AI_FILE_WARN, true));

const content = ref('');
const question = ref('');

const containerRef = ref<HTMLDivElement>();
const fullscreen = ref(false);
const loading = ref(false);
const activeKey = ref('1');

const ai = ref<ArticleAi>(getDefaultArticleAi());
let rev: string | undefined = undefined;

const allowInsert = computed(() => editorType.value === ArticleTypeEnum.MARKDOWN);
const allowAsk = computed(() => editorType.value === ArticleTypeEnum.MARKDOWN ||
    editorType.value === ArticleTypeEnum.RICH_TEXT ||
    editorType.value === ArticleTypeEnum.CODE);
const prompts = computed(() => useAiAskPromptStore().prompts);

// ------------------------------------------ 简单事件 ------------------------------------------

function toggle() {
    fullscreen.value = !fullscreen.value;
}

function scrollBottom() {
    if (containerRef.value) {
        containerRef.value?.scrollTo(0, containerRef.value?.scrollHeight);
    }
}

function closeWarn() {
    showWarn.value = false;
    setItem(LocalNameEnum.KEY_ARTICLE_AI_FILE_WARN, false);
}


// ------------------------------------------ 聊天相关 ------------------------------------------

function sendChat() {
    const str = content.value.trim();
    if (str === '') {
        return;
    }
    const {openAi, model} = useChatSettingStore();
    if (!openAi) {
        MessageUtil.warning("系统异常，openai客户端未找到！");
        return;
    }
    ai.value.chat.messages.push({
        role: 'user',
        content: str
    });
    loading.value = true;
    scrollBottom();

    openAi.chat.completions.create({
        model: model,
        messages: ai.value.chat.messages
    }).then(res => {
        const rsp = res.choices.sort((a, b) => a.index - b.index).map(e => e.message.content).join("/n");
        ai.value.chat.messages.push({
            role: 'assistant',
            content: rsp
        });
        content.value = '';
        scrollBottom();
    }).catch(e => MessageUtil.error("聊天发生错误", e)).finally(() => loading.value = false);
}

function clearChat() {
    ai.value.chat.messages = [{
        role: 'system',
        content: '你好，我是Ai小助手，需要帮助吗？'
    }];
}

onMounted(async () => {
    // 初始化
    if (props.articleIndex) {
        const res = await getFromOneByAsync(LocalNameEnum.ARTICLE_AI + props.articleIndex.id)
        if (res.record) {
            ai.value = res.record
        }
        rev = res.rev;
    }
    watch(() => ai.value, value => {
        // 自动保存
        if (props.articleIndex) {
            saveOneByAsync(LocalNameEnum.ARTICLE_AI + props.articleIndex.id, value, rev)
                .then(res => {
                    rev = res;
                });
        }
    }, {deep: true});
});

// ------------------------------------------ 问答相关 ------------------------------------------

function sendToAsk() {
    const str = question.value.trim();
    if (str === '') {
        MessageUtil.warning("请输入问题内容")
        return;
    }
    loading.value = true;
    _sendToAsk()
        .then(() => MessageUtil.success("问题提交成功"))
        .catch(e => MessageUtil.error("问题提交失败", e))
        .finally(() => loading.value = false);
}

async function _sendToAsk() {
    const str = question.value.trim();
    if (str === '') {
        return;
    }
    const {openAi, model} = useChatSettingStore();
    if (!openAi) {
        MessageUtil.warning("系统异常，openai客户端未找到！");
        return;
    }

    ai.value.ask.question = str;
    ai.value.ask.answer = '';
    question.value = '';

    const content: string = await getFileContent();

    const res = await openAi.chat.completions.create({
        model: model,
        messages: [{
            role: 'user',
            content: content
        }, {
            role: 'user',
            content: str
        }]
    })
    ai.value.ask.answer = res.choices.sort((a, b) => a.index - b.index).map(e => e.message.content).join("/n");
}

// ------------------------------------------ 相关事件 ------------------------------------------

function sendToChat(str: string) {
    content.value = str;
    sendChat();

}

function insertToArticle(content: string) {
    emits('insertToArticle', '\n\n' + content);
}

// ------------------------------------------ 你问我答 ------------------------------------------

async function uploadFile() {
    const {openAi} = useChatSettingStore();
    try {
        loading.value = true;
        if (openAi) {
            if (props.articleIndex) {
                const res = await getFromOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + props.articleIndex.id);
                const record = res.record;
                if (record) {
                    // 获取文件
                    let file: Blob;
                    let fileName = '';
                    if (props.articleIndex.type === ArticleTypeEnum.MARKDOWN) {
                        file = stringToBlob(record.content);
                        fileName = props.articleIndex.name + '.md';
                    } else if (props.articleIndex.type === ArticleTypeEnum.CODE) {
                        file = stringToBlob(record.content)
                        fileName = props.articleIndex.name;
                    } else if (props.articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                        file = stringToBlob(htmlToMarkdown(record.content));
                        fileName = props.articleIndex.name + '.md';
                    } else if (props.articleIndex.type === ArticleTypeEnum.MIND_MAP) {
                        // mind-map转md
                        file = stringToBlob(mindMapToMarkdown(record.content));
                        fileName = props.articleIndex.name + '.md';
                    } else if (props.articleIndex.type === ArticleTypeEnum.DRAUU) {
                        throw new Error("画板不支持一问一答")
                    } else {
                        throw new Error("文章类型不支持");
                    }
                    // 文件上传
                    const fileObj = await openAi.files.create({
                        file: new File([file], fileName),
                        purpose: 'assistants'
                    });
                    ai.value.ask = {
                        ...ai.value.ask,
                        fileId: fileObj.id,
                        version: res.rev ? res.rev.split('-').pop() || '1' : '1',
                    }
                }
            }
        }
    } catch (e) {
        MessageUtil.error("文件上传失败", e);
    } finally {
        loading.value = false;
    }

}

async function getFileContent(): Promise<string> {
    if (props.articleIndex) {
        const res = await getFromOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + props.articleIndex.id);
        const record = res.record;
        if (record) {
            // 获取文件
            if (props.articleIndex.type === ArticleTypeEnum.MARKDOWN) {
                return record.content
            } else if (props.articleIndex.type === ArticleTypeEnum.CODE) {
                return record.content
            } else if (props.articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                return htmlToMarkdown(record.content)
            } else if (props.articleIndex.type === ArticleTypeEnum.MIND_MAP) {
                // mind-map转md
                return mindMapToMarkdown(record.content)
            } else if (props.articleIndex.type === ArticleTypeEnum.DRAUU) {
                throw new Error("画板不支持一问一答")
            } else {
                throw new Error("文章类型不支持");
            }
        } else {
            throw new Error("文章内容不存在");
        }
    } else {
        throw new Error("系统异常，文章信息不存在");
    }
}


</script>
<style lang="less">
@import "./index.less";
</style>

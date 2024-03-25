<template>
    <div class="editor-content-ai"
         :style="{position: fullscreen ? 'fixed' : 'absolute', backgroundColor: fullscreen ? 'var(--color-bg-1)' : ''}">
        <header class="header">
            <a-tabs hide-content v-model:active-key="activeKey" type="capsule">
                <a-tab-pane title="聊天" key="1" :disabled="loading"/>
                <a-tab-pane title="你问我答" key="2" :disabled="loading"/>
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
                        <div class="message">
                            <div class="message-user">
                                {{ renderRole(message.role) }}
                            </div>
                            <div class="message-content" v-html="renderContent(message.content)">
                            </div>
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
                        </div>
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
                        <a-button type="text" status="danger" :loading="loading" @click="clearMsg()">
                            <template #icon>
                                <icon-delete/>
                            </template>
                        </a-button>
                    </a-tooltip>
                    <a-input placeholder="聊点什么吧..." allow-clear v-model="content" :disabled="loading"
                             @keydown.enter="sendMsg()"/>
                    <a-button type="text" @click="sendMsg()" :loading="loading">
                        <template #icon>
                            <icon-send/>
                        </template>
                    </a-button>
                </a-input-group>
            </div>
        </main>
        <main class="main" v-show="activeKey === '2'">
            <div class="container">
                <a-alert type="warning" closable v-if="showWarn">此操作会将文章内容附带提交
                    <template #action>
                        <a-button size="small" type="text" @click="closeWarn()">不再提示</a-button>
                    </template>
                </a-alert>
                <a-alert type="warning" v-if="ai.ask.fileId === ''" style="margin-top: 7px;">
                    暂未上传文件
                    <template #action>
                        <a-button size="small" type="text" @click="uploadFile()" :loading="loading">上传</a-button>
                    </template>
                </a-alert>
                <a-alert v-else>
                    已上传文件，文件版本：{{ ai.ask.version }}
                    <template #action>
                        <a-button size="small" type="text" :loading="loading">重新上传</a-button>
                    </template>

                </a-alert>
            </div>
            <div class="input">
                <a-input-group>
                    <a-input placeholder="对于这篇文章，你有什么想问的？" allow-clear v-model="question"
                             :disabled="loading"
                             @keydown.enter="sendMsg()"/>
                    <a-button type="text" @click="sendMsg()" :loading="loading" :disabled="!allowInsert">
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
import {editorType, robot, useArticleInsertEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {ArticleIndex} from "@/entity/article";
import {execCopy, renderContent, renderRole} from "./func";
import {ArticleAi, getDefaultArticleAi} from "@/entity/article/ArticleAi";
import {getFromOneByAsync, getItemByDefault, saveOneByAsync, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {htmlToMarkdown, mindMapToMarkdown, stringToBlob} from "@/utils/file/ConvertUtil";

const props = defineProps({
    articleIndex: Object as PropType<ArticleIndex>
});
defineExpose({sendToMessage});

const showWarn = ref(getItemByDefault(LocalNameEnum.KEY_ARTICLE_AI_FILE_WARN, true));

const content = ref('');
const question = ref('');

const containerRef = ref<HTMLDivElement>();
const fullscreen = ref(false);
const loading = ref(false);
const activeKey = ref('1');

const ai = ref<ArticleAi>(getDefaultArticleAi());
let rev: string | undefined = undefined;

watch(() => ai.value, value => {
    // 自动保存
    saveOneByAsync(LocalNameEnum.ARTICLE_AI, value, rev)
        .then(res => {
            rev = res;
        })
}, {deep: true});

const allowInsert = computed(() =>
    editorType.value === ArticleTypeEnum.MARKDOWN || editorType.value === ArticleTypeEnum.RICH_TEXT);

function toggle() {
    fullscreen.value = !fullscreen.value;
}

function scrollBottom() {
    if (containerRef.value) {
        containerRef.value?.scrollTo(0, containerRef.value?.scrollHeight);
    }
}


function sendMsg() {
    const str = content.value.trim();
    robot.value = false;
    if (str === '') {
        return;
    }
    const {openAi, model} = useChatSettingStore();
    if (!openAi) {
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

function sendToMessage(str: string) {
    content.value = str;
    sendMsg();

}

function clearMsg() {
    ai.value.chat.messages = [];
}

onMounted(() => {
    // 初始化
    if (!props.articleIndex) {
        getFromOneByAsync(LocalNameEnum.ARTICLE_AI).then(res => {
            if (res.record) {
                ai.value = res.record
            }
            rev = res.rev;
        })
    }
});

function insertToArticle(content: string) {
    useArticleInsertEvent.emit({
        id: useHomeEditorStore().id,
        content: '\n\n' + content
    })
}

function closeWarn() {
    showWarn.value = false;
    setItem(LocalNameEnum.KEY_ARTICLE_AI_FILE_WARN, false);
}

// ------------------------------------------ 你问我答 ------------------------------------------

async function uploadFile() {
    const {openAi} = useChatSettingStore();
    try {
        loading.value = true;
        console.log(openAi)
        if (openAi) {
            console.log(props.articleIndex)
            if (props.articleIndex) {
                const res = await getFromOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + props.articleIndex.id);
                const record = res.record;
                console.log(record)
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


</script>
<style lang="less">
@import "./index.less";
</style>

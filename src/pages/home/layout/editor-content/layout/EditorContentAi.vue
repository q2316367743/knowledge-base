<template>
    <div class="editor-content-ai">
        <div class="container" ref="containerRef">
            <a-row>
                <a-col :span="20">
                    <div class="message">
                        <div class="message-user">
                            AI小助手
                        </div>
                        <div class="message-content">
                            你好，我是Ai小助手，需要帮助吗？
                        </div>
                        <div class="message-tool"></div>
                    </div>
                </a-col>
            </a-row>
            <a-row v-for="message in messages">
                <a-col :span="20">
                    <div class="message">
                        <div class="message-user">
                            {{ renderRole(message.role) }}
                        </div>
                        <div class="message-content">
                            {{ message.content }}
                        </div>
                        <div class="message-tool">
                            <a-button-group type="text">
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
                <a-input placeholder="请输入您的问题" allow-clear v-model="content" :disabled="loading"
                         @keydown.enter="sendMsg()"/>
                <a-button type="text" @click="sendMsg()" :loading="loading">
                    <template #icon>
                        <icon-send/>
                    </template>
                </a-button>
            </a-input-group>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {loading, messages, sendMessage} from "@/store/setting/ChatSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {editorType, useArticleInsertEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";


let user = utools.getUser();
const nickname = user ? user.nickname : '游客';

const content = ref('');
const containerRef = ref<HTMLDivElement>();

const allowInsert = computed(() =>
    editorType.value === ArticleTypeEnum.MARKDOWN || editorType.value === ArticleTypeEnum.RICH_TEXT);


function renderRole(role: string) {
    switch (role) {
        case "system":
            return "系统";
        case "user":
            return nickname;
        case "assistant":
            return "AI小助手";
        case "tool":
            return "工具";
        case "function":
            return "方法";
        default:
            return role;
    }
}

const execCopy = (content: string) => {
    utools.copyText(content);
    MessageUtil.success("已复制到剪切板")
}

function scrollToBottom() {
    if (containerRef.value) {
        containerRef.value.scrollTo(0, containerRef.value.scrollHeight);
    }
}

onMounted(scrollToBottom);

function sendMsg() {
    if (content.value.trim() === '') {
        return;
    }
    sendMessage(content.value, () => {
        scrollToBottom();
        content.value = '';
    });
    scrollToBottom();
}

function insertToArticle(content: string) {
    useArticleInsertEvent.emit({
        id: useHomeEditorStore().id,
        content: '\n\n' + content
    })
}

</script>
<style lang="less">
.editor-content-ai {
    position: relative;
    height: 100%;
    width: 100%;

    .container {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        bottom: 94px;
        overflow: auto;

        .message {
            margin-top: 14px;

            &:hover {
                .message-tool {
                    visibility: visible;
                }
            }

            .message-user {
                display: block;
                font-size: 12px;
                margin-bottom: 5px;
                color: var(--color-text-2);
            }

            .message-content {
                background-color: var(--color-fill-1);
                border-radius: 2px;
                margin-right: auto;
                padding: 10px 16px;
                width: fit-content;
                margin-top: 4px;
            }

            .message-tool {
                visibility: hidden;
                height: 32px;
            }
        }

    }

    .input {
        position: absolute;
        left: 7px;
        right: 7px;
        bottom: 7px;
        padding: 7px;

        .arco-input-group {
            width: 100%;
        }
    }
}
</style>

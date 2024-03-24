<template>
    <div class="editor-content-ai" :style="{position: fullscreen ? 'fixed' : 'absolute', backgroundColor: fullscreen ? 'var(--color-bg-1)' : ''}">
        <header class="header">
            <a-tabs hide-content v-model:active-key="activeKey" type="capsule">
                <a-tab-pane title="聊天" key="1"/>
                <a-tab-pane title="你问我答" key="2"/>
                <template #extra>
                    <a-button type="text" @click="toggle()">
                        <icon-fullscreen-exit v-if="fullscreen" />
                        <icon-fullscreen v-else/>
                    </a-button>
                </template>
            </a-tabs>
        </header>
        <main class="main" v-show="activeKey === '1'">
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
                            <div class="message-content" v-html="renderContent(message.content)">
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
                <a-alert type="warning" closable>此操作会将文章内容附带提交</a-alert>
            </div>
            <div class="input">
                <a-input-group>
                    <a-input placeholder="对于这篇文章，你有什么想问的？" allow-clear v-model="content" :disabled="!allowInsert"
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
import {computed, onMounted, ref} from "vue";
import {activeKey, loading, messages, sendMessage} from "@/store/setting/ChatSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {editorType, useArticleInsertEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import CherryEngine from "cherry-markdown/dist/cherry-markdown.engine.core"


let user = utools.getUser();
const nickname = user ? user.nickname : '游客';

const content = ref('');
const containerRef = ref<HTMLDivElement>();
const fullscreen = ref(false);

const allowInsert = computed(() =>
    editorType.value === ArticleTypeEnum.MARKDOWN || editorType.value === ArticleTypeEnum.RICH_TEXT);

function toggle() {
    fullscreen.value = !fullscreen.value;
}

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

function renderContent(content: string) {
    const engine = new CherryEngine({});
    // @ts-ignore
    return engine.makeHtml(content);
}

const execCopy = (content: string) => {
    utools.copyText(content);
    MessageUtil.success("已复制到剪切板")
}


onMounted(() => {
    // 创建一个新的MutationObserver实例
    const observer = new MutationObserver(() => {
        if (!containerRef.value) {
            return;
        }
        // 当内容发生变化时，滚动到底部
        containerRef.value.scrollTop = containerRef.value.scrollHeight;
    });

    // 配置并开始观察目标节点
    const config = {childList: true, subtree: true};
    if (containerRef.value) {
        observer.observe(containerRef.value, config);
    }
});

function sendMsg() {
    if (content.value.trim() === '') {
        return;
    }
    sendMessage(content.value, () => {
        content.value = '';
    });
}

function clearMsg() {
    messages.value = [];
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 51;

    .main {
        position: absolute;
        top: 39px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }


    .container {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;
        bottom: 46px;
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
                margin-top: 4px;
                p {
                    line-height: 1.5;
                }
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

        .arco-input-group {
            width: 100%;
        }
    }
}
</style>

<template>
  <div class="ai-chat-editor">
    <chat
      ref="chatRef"
      :data="items"
      :clear-history="false"
      :text-loading="false"
      :is-stream-load="false"
      class="ai-chat-editor-content"
      @scroll="handleChatScroll"
    >
      <template #content="{ item }">
        <chat-reasoning v-if="item.think?.length > 0" expand-icon-placement="right">
          <template #header>
            <div style="display: flex; align-items: center">
              <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px"/>
              <span>已深度思考</span>
            </div>
          </template>
          <chat-content v-if="item.think.length > 0" :value="item.think"/>
        </chat-reasoning>
        <chat-content v-if="item.content.length > 0" :content="item.content" :class="[item.role]"/>
      </template>
      <template #actions="{ item, index }">
        <t-space size="small" class="mt-8px">
          <t-tooltip content="复制">
            <t-button theme="primary" variant="text" shape="square" size="small"
                      @click="handleOperator('copy', item, index)">
              <template #icon>
                <copy-icon/>
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip content="分享">
            <t-button theme="primary" variant="text" shape="square" size="small"
                      @click="handleOperator('share', item, index)">
              <template #icon>
                <share-icon/>
              </template>
            </t-button>
          </t-tooltip>
        </t-space>
      </template>
    </chat>
    <t-button v-if="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
      <arrow-down-icon/>
    </t-button>
  </div>
</template>
<script lang="ts" setup>
import {AiChatItem, AiChatWrap} from "@/entity/ai/AiChat";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  CopyIcon,
  ShareIcon,
} from "tdesign-icons-vue-next";
import {Chat, ChatContent, ChatInstanceFunctions, ChatReasoning} from "@tdesign-vue-next/chat";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const content = defineModel<AiChatWrap>({
  default: {}
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  articleId: Number,
});


const chatRef = ref<ChatInstanceFunctions>();

const isShowToBottom = ref(false);

const items = computed<Array<AiChatItem>>(() => content.value.items || []);

// 是否显示回到底部按钮
const handleChatScroll = function (context: any) {
  const {e} = context;
  const scrollTop = (e.target as HTMLDivElement)?.scrollTop || 0;
  isShowToBottom.value = scrollTop < 0;
};
// 滚动到底部
const backBottom = () => {
  chatRef.value?.scrollToBottom?.({
    behavior: 'smooth',
  });
};
// 复制
const handleOperator = (op: string, item: AiChatItem, index: number) => {
  switch (op) {
    case 'copy':
      return InjectionUtil.copyText(item.content)
    case 'share':
      break;
  }
}
</script>
<style scoped lang="less">
.ai-chat-editor {
  width: 100%;
  height: 100%;

  .ai-chat-editor-content {
    height: 100%;

    :deep(.t-chat__list) {
      padding-right: 8px;
    }

  }
}
</style>

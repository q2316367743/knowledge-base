<template>
  <div class="chat-article">
    <div class="chat-article__title">{{ message.q }}</div>
    <div class="chat-article__time">
      <t-space>
        <div>{{ toDateString(message.id) }}</div>
        <div>{{ assistant }}</div>
        <template #separator>
          <t-divider layout="vertical"/>
        </template>
      </t-space>
    </div>
    <div class="chat-article__content">
      <t-skeleton animation="gradient" v-if="loading && message.id === lastId" :row-col="[1,1,1]">
      </t-skeleton>
      <chat-content :value="message.a" v-else/>
      <t-divider v-if="message.id === lastId">
        <icon-loading spin/>
      </t-divider>
      <template v-else>
        <div class="chat-article__option" :class="{last: message.id === lastId}">
          <t-space size="small">
            <t-tooltip content="记笔记">
              <t-button variant="text" theme="primary" shape="square" @click="add">
                <template #icon>
                  <edit-icon/>
                </template>
              </t-button>
            </t-tooltip>
            <t-tooltip content="复制">
              <t-button variant="text" theme="primary" shape="square" @click="copy()">
                <template #icon>
                  <copy-icon/>
                </template>
              </t-button>
            </t-tooltip>
          </t-space>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ChatMessage} from "@/types/Chat";
import {useChatStore} from "@/store/components/ChatStore";
import {toDateString} from "@/utils/lang/FormatUtil";
import {copyText} from "@/utils/utools/NativeUtil";
import {addNoteFromAi} from "@/pages/home/modal/addNote";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import ChatContent from "@/components/ChatContent/ChatContent.vue";
import {CopyIcon, EditIcon} from "tdesign-icons-vue-next";

const router = useRouter();

const props = defineProps({
  message: {
    type: Object as PropType<ChatMessage>,
    default: () => ({
      id: Date.now(),
      q: '',
      a: '',
      assistantId: '',
    })
  },
});
const lastId = computed(() => useChatStore().lastId);
const loading = computed(() => useChatStore().loading);
const assistant = computed(() => {
  const {aiAssistantMap} = useAiAssistantStore();
  return aiAssistantMap.get(props.message.assistantId)?.name || ''
})

function copy() {
  copyText(props.message.a);
}

function add() {
  addNoteFromAi(props.message, () => {
    router.push('/note')
  });
}
</script>
<style scoped lang="less">
.chat-article {
  max-width: 700px;
  margin: 32px auto 0;
  padding: 20px 20px 12px;

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__time {
    color: var(--color-text-2);
    margin-top: 24px;
    font-size: 0.9rem;
  }

  &__content {
    margin-top: 32px;
  }

  &__option {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--td-border-level-1-color);
  }
}
</style>

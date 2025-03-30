<template>
  <div class="chat-article">
    <div class="chat-article__title">{{ message.q }}</div>
    <div class="chat-article__time">
      <t-space size="4px">
        <div>{{ toDateTimeString(message.id) }}</div>
        <div>{{ assistant }}</div>
        <template #separator>
          <t-divider layout="vertical"/>
        </template>
      </t-space>
    </div>
    <div class="chat-article__content">
      <t-skeleton animation="gradient" v-if="loading && message.id === lastId" :row-col="[1,1,1]"/>
      <template v-else>
        <chat-reasoning :text="message.t" :think="message.isThinking" class="mb-8px" v-if="message.t"/>
        <chat-content :value="message.a"/>
      </template>
      <t-divider v-if="message.id === lastId">
        <icon-loading spin/>
      </t-divider>
      <div class="chat-article__option" :class="{last: message.id === lastId}" v-else>
        <t-space size="small">
          <t-tooltip content="重新提问">
            <t-button variant="text" theme="primary" shape="square">
              <template #icon>
                <refresh-icon/>
              </template>
            </t-button>
          </t-tooltip>
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
    </div>
  </div>
</template>
<script lang="ts" setup>
import {CopyIcon, EditIcon, RefreshIcon} from "tdesign-icons-vue-next";
import {ChatMessage} from "@/types/Chat";
import {useAiAssistantStore, useChatStore} from "@/store";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {copyText} from "@/utils/utools/NativeUtil";
import {addNoteFromAi} from "@/pages/home/modal/addNote";

const router = useRouter();

const props = defineProps({
  message: {
    type: Object as PropType<ChatMessage>,
    default: () => ({
      id: Date.now(),
      assistantId: '',
      q: '',
      t: '',
      a: '',
      isThinking: false,
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
    color: var(--td-text-color-secondary);
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

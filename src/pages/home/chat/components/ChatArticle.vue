<template>
  <div class="chat-article">
    <div class="chat-article__title">{{ message.q }}</div>
    <div class="chat-article__time">
      <a-space>
        <div>{{ toDateString(message.id) }}</div>
        <div>{{ message.m }}</div>
        <template #split>
          <a-divider direction="vertical"/>
        </template>
      </a-space>
    </div>
    <div class="chat-article__content">
      <chat-article-content :value="message.a"/>
      <a-divider v-if="message.id === lastId">
        <icon-loading spin/>
      </a-divider>
      <template v-else>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 8px">
          <a-space>
            <a-tooltip content="记笔记">
              <a-button type="text" @click="add">
                <template #icon>
                  <icon-edit/>
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip content="复制">
              <a-button type="text" @click="copy()">
                <template #icon>
                  <icon-copy/>
                </template>
              </a-button>
            </a-tooltip>
          </a-space>
        </div>
        <a-divider :margin="0">

        </a-divider>
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
import ChatArticleContent from "@/pages/home/chat/components/ChatArticleContent.vue";

const router = useRouter();

const props = defineProps({
  message: {
    type: Object as PropType<ChatMessage>,
    default: () => ({
      id: Date.now(),
      q: '',
      a: '',
      m: '',
      f: []
    })
  },
});
const lastId = computed(() => useChatStore().lastId);

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
}
</style>

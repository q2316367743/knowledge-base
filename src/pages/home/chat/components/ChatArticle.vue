<template>
  <div class="chat-article">
    <div class="chat-article__title">{{ message.q }}</div>
    <div class="chat-article__time">
      <a-space>
        <div>{{ now }}</div>
        <div>{{ message.m }}</div>
        <template #split>
          <a-divider direction="vertical"/>
        </template>
      </a-space>
    </div>
    <div class="chat-article__content">
      <chat-article-content :value="answer"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import ChatArticleContent from "@/pages/home/chat/components/ChatArticleContent.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {buildChatMessage, ChatArticleItem, ChatMessageInjection} from "@/pages/home/chat/types";

const answer = defineModel({
  type: String,
  default: ""
});

const props = defineProps({
  message: {
    type: Object as PropType<ChatArticleItem>,
    default: () => ({
      q: '',
      a: '',
      m: ''
    })
  },
});
const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

const cm = inject(ChatMessageInjection, ref(buildChatMessage()));


async function init() {
  const {q, m} = props.message;
  if (!q) {
    MessageUtil.error("问题不存在")
    return;
  }
  const {openAi, model} = useChatSettingStore();
  if (openAi) {
    console.log("init", q, m, cm.value);
    // 上下文
    const response = await openAi.chat?.completions.create({
      model: (m || model) as string,
      messages: [{
        role: 'user',
        content: q as string,
      }],
      stream: true,
    });
    // 流式处理结果
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      answer.value += content;
      // TODO: 滚动到底部
    }
  }
}

onMounted(() => {
  cm.value.loading = true;
  init()
    .catch(e => MessageUtil.error("提问失败", e))
    .finally(() => cm.value.loading = false);
})
</script>
<style scoped lang="less">
.chat-article {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;

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

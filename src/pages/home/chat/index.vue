<template>
  <div class="home-chat" ref="homeChatRef">
    <h1>聊天</h1>
    <div>问题；{{ question }}</div>
    <div>模型：{{ module }}</div>
    <chat-article v-for="m in messages" :question="m.q" :answer="m.a"/>
  </div>
</template>
<script lang="ts" setup>
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ChatArticleItem} from "@/pages/home/chat/types";
import ChatArticle from "@/pages/home/chat/components/ChatArticle.vue";

const route = useRoute();

const homeChatRef = ref<HTMLDivElement>();
const messages = ref(new Array<ChatArticleItem>())

const question = computed(() => route.query.question);
const module = computed(() => route.query.model);

async function init() {
  const {question} = route.query;
  if (!question) {
    MessageUtil.error("问题不存在")
    return;
  }
  messages.value.push({
    q: question as string,
    a: '',
  })
  const {openAi, model} = useChatSettingStore();
  if (openAi) {
    const response = await openAi.chat?.completions.create({
      model: (route.query.model || model) as string,
      messages: [{
        role: 'user',
        content: question as string,
      }],
      stream: true,
    });
    // 流式处理结果
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      messages.value[messages.value.length - 1].a += content;
      // 滚动到底部
      if (homeChatRef.value) {
        homeChatRef.value.scrollTop = homeChatRef.value.scrollHeight;
      }
    }
  }
}

onMounted(() => {
  init().catch(e => MessageUtil.error("提问失败", e));
})
</script>
<style scoped lang="less">
.home-chat {
  height: 100vh;
  overflow: auto;
}
</style>

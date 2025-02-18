<template>
  <div class="home-chat">
    <div class="home-chat__content">
      <a-scrollbar style="height: calc(100vh - 72px);overflow: auto;">
        <div class="scrollbar">
          <a-space direction="vertical">
            <chat-article v-for="(m, i) in cm.messages" :message="m" v-model="cm.messages[i].a"/>
            <template #split>
              <a-divider/>
            </template>
          </a-space>
        </div>
      </a-scrollbar>
    </div>
    <div class="home-chat__footer">
      <div class="input">
        <ai-input @ask="ask"/>
      </div>
    </div>
    <div class="home-chat__close">
      <a-button type="text" @click="goBack">
        <template #icon>
          <icon-arrow-left/>
        </template>
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {buildChatMessage, ChatMessage, ChatMessageInjection} from "@/pages/home/chat/types";
import ChatArticle from "@/pages/home/chat/components/ChatArticle.vue";
import AiInput from "@/pages/home/components/AiInput.vue";
import {AiInputProps} from "@/pages/home/types";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useSnowflake} from "@/hooks/Snowflake";

const route = useRoute();
const router = useRouter();

const cm = ref<ChatMessage>(buildChatMessage());

provide(ChatMessageInjection, cm);

onMounted(() => {
  cm.value.messages.push({
    id: useSnowflake().nextId(),
    q: route.query.question as string,
    a: '',
    m: route.query.model as string
  })
});
const goBack = () => router.back();

function ask(p: AiInputProps) {
  const {question, model} = p;
  // 跳转
  if (cm.value.loading) {
    MessageUtil.warning("正在回答中，请稍候");
    return;
  }
  cm.value.messages.push({
    id: useSnowflake().nextId(),
    q: question,
    a: '',
    m: model
  })
}
</script>
<style scoped lang="less">
.home-chat {
  height: 100vh;
  overflow: auto;

  .home-chat__content {
    height: calc(100vh - 72px);

    .scrollbar {

      width: 700px;
      margin: 0 auto;
    }

  }

  .home-chat__footer {
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    .input {
      width: 700px;
    }
  }

  .home-chat__close {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>

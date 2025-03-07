<template>
  <div class="home-chat">
    <div class="home-chat__container">
      <div class="home-chat__content">
        <div class="scrollbar">
          <chat-article v-for="m in messages" :message="m" :key="m.id"/>
        </div>
      </div>
      <div class="home-chat__footer">
        <div class="input">
          <ai-input/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useChatStore} from "@/store/components/ChatStore";
import ChatArticle from "@/pages/home/chat/components/ChatArticle.vue";
import AiInput from "@/pages/home/components/AiInput.vue";

const messages = computed(() => useChatStore().messages);
</script>
<style scoped lang="less">
.home-chat {
  height: calc(100vh - 48px);
  position: relative;
  display: flex;
  flex-direction: column;

  &__container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column-reverse;

    .scrollbar {
      width: 700px;
      margin: 0 auto;
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 12px 0;

    .input {
      width: 700px;
    }
  }

}
</style>

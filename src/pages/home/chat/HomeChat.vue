<template>
  <div class="home-chat" >
    <div class="home-chat__content">
      <a-scrollbar style="height: calc(100vh - 72px);overflow: auto;" ref="scrollbar">
        <div class="scrollbar" ref="el">
          <chat-article v-for="m in messages" :message="m" :key="m.id"/>
        </div>
      </a-scrollbar>
    </div>
    <div class="home-chat__footer">
      <div class="input">
        <ai-input/>
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
import {ScrollbarInstance} from "@arco-design/web-vue";
import {chatToBottomEvent, useChatStore} from "@/store/components/ChatStore";
import ChatArticle from "@/pages/home/chat/components/ChatArticle.vue";
import AiInput from "@/pages/home/components/AiInput.vue";

const el = ref<HTMLDivElement>();
const scrollbar = ref<ScrollbarInstance>();

const messages = computed(() => useChatStore().messages);

const goBack = () => useChatStore().clear();

chatToBottomEvent.on(() => {
  scrollbar.value?.scrollTo({
    top: el.value?.scrollHeight
  });
})


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

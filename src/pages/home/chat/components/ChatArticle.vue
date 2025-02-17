<template>
  <div class="chat-article">
    <div class="chat-article__title">{{ question }}</div>
    <div class="chat-article__time">{{ now }}</div>
    <div class="chat-article__content">
      <chat-article-content :value="answer"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import ChatArticleContent from "@/pages/home/chat/components/ChatArticleContent.vue";

defineProps({
  question: {
    type: String,
    default: ""
  },
  answer: {
    type: String,
    default: ""
  }
});
const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
</script>
<style scoped lang="less">
.chat-article {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__time {
    color: var(--color-text-2);
    margin-top: 32px;
  }

  &__content {
    margin-top: 32px;
  }
}
</style>

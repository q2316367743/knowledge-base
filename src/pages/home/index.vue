<template>
  <div class="home">
    <home-welcome v-if="empty"/>
    <home-chat v-else/>
  </div>
</template>
<script lang="ts" setup>
import {useChatStore} from "@/store/components/ChatStore";
import HomeWelcome from "@/pages/home/welcome/HomeWelcome.vue";
import HomeChat from "@/pages/home/chat/HomeChat.vue";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";

const empty = computed(() => useChatStore().empty);

useAiAssistantStore().init();
useAiServiceStore().init();
</script>
<style scoped lang="less">

</style>

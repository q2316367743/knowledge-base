<template>
  <div class="home">
    <home-header/>
    <div class="home-container">
      <home-welcome v-if="empty"/>
      <home-chat v-else/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useChatStore} from "@/store/components/ChatStore";
import HomeWelcome from "@/pages/home/welcome/HomeWelcome.vue";
import HomeChat from "@/pages/home/chat/HomeChat.vue";
import HomeHeader from "@/pages/home/components/HomeHeader.vue";

const empty = computed(() => useChatStore().empty);

</script>
<style scoped lang="less">
.home {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--td-bg-color-container);

  .home-container {
    position: absolute;
    top: 48px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

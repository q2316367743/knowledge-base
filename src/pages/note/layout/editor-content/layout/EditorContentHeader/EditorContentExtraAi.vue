<template>
  <a-tooltip content="AI助理" position="bottom" v-if="useChatSettingStore().enable">
    <a-button @click="openAiChatWidget()" type="text">
      <template #icon>
        <icon-robot/>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script lang="ts" setup>
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {openAiChatWidget} from "@/widget/AiChat";

</script>
<style scoped lang="less">

</style>

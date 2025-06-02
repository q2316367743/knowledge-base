<template>
  <t-tooltip content="AI助理" placement="bottom" v-if="editorType && editorType !== ArticleTypeEnum.AI_CHAT">
    <t-button @click="openAiChatWidget()" variant="text" theme="primary" shape="square">
      <template #icon>
        <chat-bubble-smile-icon/>
      </template>
    </t-button>
  </t-tooltip>
</template>
<script lang="ts" setup>
import {ChatBubbleSmileIcon} from "tdesign-icons-vue-next";
import {openAiChatWidget} from "@/widget/AiChat";
import {editorType} from "@/store";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
</script>
<style scoped lang="less">

</style>

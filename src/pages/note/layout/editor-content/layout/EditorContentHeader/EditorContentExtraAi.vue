<template>
  <t-tooltip content="AI助理" placement="bottom">
    <t-button @click="openAiChatWidget()" variant="text" theme="primary" shape="square">
      <template #icon>
        <icon-robot/>
      </template>
    </t-button>
  </t-tooltip>
</template>
<script lang="ts" setup>
import {openAiChatWidget} from "@/widget/AiChat";
</script>
<style scoped lang="less">

</style>

<template>
  <t-button theme="primary" variant="text" shape="square" size="small" @click="fs = !fs">
    <template #icon>
      <fullscreen-exit-icon v-if="fs"/>
      <fullscreen-icon v-else/>
    </template>
  </t-button>
</template>
<script lang="ts" setup>
import {FullscreenExitIcon, FullscreenIcon} from "tdesign-icons-vue-next";
const fs = defineModel({
  type: Boolean,
  default: false
})
</script>
<style scoped lang="less">

</style>

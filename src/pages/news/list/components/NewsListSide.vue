<template>
  <t-aside class="news-list-aside">
    <t-header class="flex p-4 justify-between">
      <t-input class="w-184px" placeholder="请输入资讯名称"></t-input>
      <t-button theme="primary" shape="square">
        <template #icon>
          <plus-icon/>
        </template>
      </t-button>
    </t-header>
  </t-aside>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";
</script>
<style scoped lang="less">

</style>

<template>
  <div class="app">
    <router-view />
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
  </div>
</template>
<script lang="ts" setup>
import {themeColor, useGlobalStore} from "@/store";

useGlobalStore().initDarkColors();
</script>
<style scoped lang="less">
.app {
  background-color: var(--td-bg-color-container);
}
</style>

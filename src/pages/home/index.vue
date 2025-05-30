<template>
  <t-layout class="home">
    <t-aside width="200px">
      <home-side />
    </t-aside>
    <t-content>
      <router-view></router-view>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import HomeSide from "@/pages/home/layout/HomeSide.vue";
</script>
<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;
}
</style>

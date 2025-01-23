<template>
  <div class="todo-content-card">
    <content-card-header/>
    <content-card-main/>
  </div>
</template>
<script lang="ts" setup>
import ContentCardHeader from "@/pages/todo/components/ContentCard/components/ContentCardHeader.vue";
import ContentCardMain from "@/pages/todo/components/ContentCard/components/ContentCardMain/index.vue";

</script>
<style lang="less">
@import "./index.less";
</style>

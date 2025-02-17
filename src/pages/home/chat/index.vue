<template>
  <div class="home-chat">
    <h1>聊天</h1>
    <div>问题；{{ question }}</div>
    <div>模型：{{ module }}</div>
  </div>
</template>
<script lang="ts" setup>
const route = useRoute();

const question = computed(() => route.query.question);
const module = computed(() => route.query.module);
</script>
<style scoped lang="less">

</style>

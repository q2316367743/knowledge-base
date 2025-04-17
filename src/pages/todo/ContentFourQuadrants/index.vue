<template>
  <div class="content-four-quadrants">
    <todo-header />
    <div class="content-four-quadrants__container">
      <four-quadrants-content/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TodoHeader from "@/pages/todo/common/TodoHeader/TodoHeader.vue";
import FourQuadrantsContent from "@/pages/todo/ContentFourQuadrants/components/FourQuadrantsContent.vue";
</script>
<style scoped lang="less">
.content-four-quadrants {
  width: 100%;
  height: 100%;
  position: relative;

  &__container {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>

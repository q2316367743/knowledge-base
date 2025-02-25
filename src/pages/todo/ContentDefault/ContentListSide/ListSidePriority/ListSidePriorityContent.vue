<template>
  <div class="content-default-group__content" >
    <content-default-item v-for="item in items" :key="item.id" :item="item"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import ContentDefaultItem from "@/pages/todo/ContentDefault/components/ContentDefaultItem.vue";

defineProps({
  items: {
    type: Object as PropType<Array<TodoItemIndex>>,
    default: []
  },
});
</script>
<style scoped lang="less">
.content-default-group__content {
  margin-top: 7px;
}
</style>

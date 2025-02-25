<template>
  <div class="content-default-group__content">
    <content-default-item v-for="item in items" :key="item.id" :item="item" :data-id="item.id"/>
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
  groupId: {
    type: String,
    default: ""
  }
});

</script>
<style scoped lang="less">

</style>

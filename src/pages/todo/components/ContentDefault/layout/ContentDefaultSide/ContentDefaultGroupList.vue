<template>
  <div class="content-default-group__content" ref="el">
    <content-default-item v-for="item in items" :key="item.id" :item="item" :data-id="item.id"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import ContentDefaultItem from "@/pages/todo/components/ContentDefault/components/ContentDefaultItem.vue";
import {useSortable} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";

const props = defineProps({
  items: {
    type: Object as PropType<Array<TodoItemIndex>>,
    default: []
  },
  groupId: {
    type: String,
    default: ""
  }
});

const el = ref();

useSortable(el, props.items, {
  animation: 150,
  handle: '.content-default-item',
  group: `todo-default-group`,
  sort: false,
  onAdd: (e) => {
    const {item} = e;
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().pushTo(props.groupId, Number(dataIdAttr.value))
    }
  },
  onRemove: (e) => {
    const {item} = e;
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().popFrom(props.groupId, Number(dataIdAttr.value))
    }
  }
});
</script>
<style scoped lang="less">

</style>

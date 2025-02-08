<template>
  <div class="content-card-empty" ref="el">

  </div>
</template>
<script lang="ts" setup>
import {useSortable} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";

const props = defineProps({
  groupId: {
    type: String,
    default: ''
  }
});

const el = ref();
const list = ref([]);

useSortable(el, list, {
  animation: 150,
  handle: '.card-todo-item',
  group: `todo-priority`,
  sort: false,
  onAdd: (e) => {
    const {item} = e;
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().pushTo(props.groupId, Number(dataIdAttr.value))
    }
  }
});
</script>
<style scoped lang="less">
.content-card-empty {
  height: 50px;
}
</style>

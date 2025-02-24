<template>
  <div></div>
</template>
<script lang="ts" setup>
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";

defineProps({
  priority: {
    type: Object as PropType<TodoGroupPriorityView>
  }
});
</script>
<style scoped lang="less">

</style>

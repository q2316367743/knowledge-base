<template>
  <main class="content-card-priority">
  </main>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {group} from "@/utils/lang/ArrayUtil";
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";

const groups = computed(() => {
  const {todoGroupView} = useTodoWrapStore();
  const priorities = todoGroupView.flatMap(e => e.children);
  const res = new Array<TodoGroupPriorityView>();
  group(priorities, "value").forEach((v, k) => {
    res.push({
      value: k,
      label: v[0].label,
      children: v.flatMap(e => e.children)
    })
  });
  return res;
});
</script>
<style scoped lang="less">
.content-card-priority {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-right: 8px;

  display: grid;
  grid-auto-flow: column; /* 横向排列 */
  grid-auto-columns: 268px; /* 每个子项宽度 */
  gap: 8px; /* 可选间隙 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动 */
}
</style>

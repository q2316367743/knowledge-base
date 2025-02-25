<template>
  <div class="content-default-group" v-if="group">
    <div class="content-default-group__header" @click.stop="toggleVisible()">
      <div class="content-default-group__header-left">
        <div class="content-default-group__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-group__header-title">{{ group.name }}</div>
        <div class="content-default-group__header-count">{{ count }}</div>
      </div>
      <div class="extra">
        <a-button type="text" @click.stop="openAddTodoItem(group)" size="mini">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
        <a-dropdown>
          <a-button type="text" size="mini" @click.stop>
            <template #icon>
              <icon-more/>
            </template>
          </a-button>
          <template #content>
            <a-doption @click="openEditTodoGroupFunc(group)">
              <template #icon>
                <icon-edit/>
              </template>
              重命名
            </a-doption>
            <a-doption @click="openAddTodoGroupFunc(group.id, 0)">
              <template #icon>
                <icon-rotate-left/>
              </template>
              在上侧添加分组
            </a-doption>
            <a-doption @click="openAddTodoGroupFunc(group.id, 1)">
              <template #icon>
                <icon-rotate-right/>
              </template>
              在下侧添加分组
            </a-doption>
            <a-doption @click="openDeleteTodoGroupFunc(group.id, group.name)">
              <template #icon>
                <icon-delete/>
              </template>
              删除
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
    <list-side-group-list v-if="visible" :group-id="group.id" :items="todoItems"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {
  openAddTodoGroupFunc,
  openDeleteTodoGroupFunc,
  openEditTodoGroupFunc
} from "@/pages/todo/common/TodoGroupFunc";
import ListSideGroupList
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideGroupList.vue";

const props = defineProps({
  group: {
    type: Object as PropType<TodoGroupView>
  }
});
const count = computed(() => {
  const {group} = props;
  let c = 0;
  if (group) {
    group.children.forEach(item => {
      c += item.children.length;
    });
  }
  return c;
});

const todoItems = computed<Array<TodoItemIndex>>(() => {
  if (!props.group) {
    return [];
  }
  const {group} = props;
  return group.children.flatMap(item => item.children);
})

const visible = ref(true);

const toggleVisible = useToggle(visible);

</script>
<style scoped lang="less">
.content-default-group {
  margin: 7px 8px 14px;
  border-radius: 2px;
  position: relative;

  .content-default-group__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .content-default-group__header-left {
      display: flex;
      height: 24px;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;


      .content-default-group__header-handle {
        color: var(--color-text-2);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .content-default-group__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .content-default-group__header-count {
        color: var(--color-text-2);
      }
    }

  }

}
</style>

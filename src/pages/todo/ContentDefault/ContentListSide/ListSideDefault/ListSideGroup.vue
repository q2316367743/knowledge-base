<template>
  <div class="content-default-group" v-if="group">
    <div class="content-default-group__header">
      <div class="content-default-group__header-left" @click.stop="toggleVisible()">
        <div class="content-default-group__header-handle">
          <chevron-down-icon :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-group__header-title">{{ group.name }}</div>
        <div class="content-default-group__header-count">{{ count }}</div>
      </div>
      <div class="extra">
        <t-button theme="primary" variant="text" shape="square" @click.stop="openAddTodoItem({group})" size="small">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
        <t-dropdown trigger="click" placement="bottom">
          <t-button theme="primary" variant="text" shape="square" size="small" @click.stop>
            <template #icon>
              <ellipsis-icon/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item @click="openEditTodoGroupFunc(group)">
              <template #prefix-icon>
                <edit2-icon/>
              </template>
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="openAddTodoGroupFunc(group.id, 0)">
              <template #prefix-icon>
                <arrow-left-up-icon/>
              </template>
              在上侧添加分组
            </t-dropdown-item>
            <t-dropdown-item @click="openAddTodoGroupFunc(group.id, 1)">
              <template #prefix-icon>
                <arrow-left-down-icon/>
              </template>
              在下侧添加分组
            </t-dropdown-item>
            <t-dropdown-item @click="openDeleteTodoGroupFunc(group.id, group.name)">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
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
import {
  ArrowLeftDownIcon,
  ArrowLeftUpIcon,
  ChevronDownIcon,
  DeleteIcon,
  Edit2Icon,
  EllipsisIcon,
  PlusIcon
} from "tdesign-icons-vue-next";

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
        color: var(--td-text-color-secondary);

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
        color: var(--td-text-color-secondary);
      }
    }

  }

}
</style>

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
            <a-doption @click="openEditTodoGroupFunc(group.id, group.name, group.children)">
              <template #icon>
                <icon-edit/>
              </template>
              重命名
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-rotate-left/>
              </template>
              在左侧添加分组
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-rotate-right/>
              </template>
              在右侧添加分组
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-translate/>
              </template>
              移动到
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
    <div class="content-default-group__content" v-show="visible" ref="el">
      <content-default-item v-for="item in todoItems" :key="item.id" :item="item" :data-id="item.id"/>
    </div>
    <todo-item-complete :completes="group.complete"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {openDeleteTodoGroupFunc, openEditTodoGroupFunc} from "@/pages/todo/components/func/TodoGroupFunc";
import TodoItemComplete from "@/pages/todo/components/common/TodoItemComplete.vue";
import ContentDefaultItem from "@/pages/todo/components/ContentDefault/components/ContentDefaultItem.vue";
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";

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
const el = ref()

const toggleVisible = useToggle(visible);


useSortable(el, todoItems, {
  animation: 150,
  handle: '.content-default-item',
  group: `todo-group`,
  sort: false,
  onUpdate: (e) => {
    // do something
    const {oldIndex = 0, newIndex = 0} = e;
    moveArrayElement(todoItems.value, oldIndex, newIndex);
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
  },
  onAdd: (e) => {
    const {item} = e;
    // useTodoGroupStore().pushTo(props.groupId, e.item.dataset.id)
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().pushTo(props.group!.id, Number(dataIdAttr.value))
    }
  },
  onRemove: (e) => {
    const {item} = e;
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().popFrom(props.group!.id, Number(dataIdAttr.value))
    }
  }
});
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

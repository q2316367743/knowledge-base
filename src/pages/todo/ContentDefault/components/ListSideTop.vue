<template>
  <div class="content-default-complete" v-if="count > 0">
    <div class="content-default-complete__header" @click.stop="toggleVisible()">
      <div class="content-default-complete__header-left">
        <div class="content-default-complete__header-handle">
          <chevron-down-icon :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-complete__header-title">已置顶</div>
        <div class="content-default-complete__header-count">{{ count }}</div>
      </div>
    </div>
    <div v-if="visible">
      <content-default-item v-for="item in items" :key="item.id" :item="item" :data-id="item.id"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ChevronDownIcon} from "tdesign-icons-vue-next";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import ContentDefaultItem from "@/pages/todo/ContentDefault/components/ContentDefaultItem.vue";

const props = defineProps({
  items: {
    type: Object as PropType<Array<TodoItemIndex>>,
    default: []
  }
});
const count = computed(() => props.items.length);

const visible = ref(true);

const toggleVisible = useToggle(visible);
</script>
<style scoped lang="less">
.content-default-complete {
  margin: 7px 8px 14px;
  border-radius: 2px;
  position: relative;

  .content-default-complete__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .content-default-complete__header-left {
      display: flex;
      height: 24px;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;


      .content-default-complete__header-handle {
        color: var(--td-text-color-secondary);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .content-default-complete__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .content-default-complete__header-count {
        color: var(--td-text-color-secondary);
      }
    }

  }

}
</style>

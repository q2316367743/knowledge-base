<template>
  <div class="content-default-group" v-if="count > 0">
    <div class="content-default-group__header" @click.stop="toggleVisible()">
      <div class="content-default-group__header-left">
        <div class="content-default-group__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-group__header-title">已完成 & 已放弃</div>
        <div class="content-default-group__header-count">{{ count }}</div>
      </div>
    </div>
    <div v-if="visible">
      <content-default-complete-list v-for="g in groups" :group-id="g.id" :items="g.complete" :key="g.id"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import ContentDefaultCompleteList
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultCompleteList.vue";

const props = defineProps({
  groups: {
    type: Object as PropType<Array<TodoGroupView>>,
    default: []
  }
});
const count = computed(() => props.groups.map(e => e.complete.length).reduce((a, b) => a + b, 0));

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

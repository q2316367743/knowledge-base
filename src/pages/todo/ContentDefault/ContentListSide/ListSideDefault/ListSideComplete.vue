<template>
  <div class="content-default-complete" v-if="count > 0">
    <div class="content-default-complete__header" @click.stop="toggleVisible()">
      <div class="content-default-complete__header-left">
        <div class="content-default-complete__header-handle">
          <chevron-down-icon :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-complete__header-title">已完成 & 已放弃</div>
        <div class="content-default-complete__header-count">{{ count }}</div>
      </div>
    </div>
    <div v-if="visible" class="mt-8px">
      <list-side-complete-list v-for="g in groups" :group-id="g.id" :items="g.complete" :key="g.id"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import ListSideCompleteList
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideCompleteList.vue";
import {ChevronDownIcon} from "tdesign-icons-vue-next";

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

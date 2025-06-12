<template>
  <div class="app-frame">
    <div>{{ todoName || '待办' }}</div>
    <div class="right">
      <t-button size="small" theme="primary" variant="text" shape="square" @click="onToggleTop">
        <template #icon>
          <pin-filled-icon v-if="alwaysOnTop"/>
          <pin-icon v-else/>
        </template>
      </t-button>
      <t-button size="small" theme="primary" variant="text" shape="square" @click="onMinimize">
        <template #icon>
          <minus-icon/>
        </template>
      </t-button>
      <t-button size="small" theme="primary" variant="text" shape="square" @click="onClose">
        <template #icon>
          <close-icon/>
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {CloseIcon, MinusIcon, PinFilledIcon, PinIcon} from "tdesign-icons-vue-next";
import {WindowUtil} from "@/utils/utools/WindowUtil";

const props = defineProps({
  todoId: {
    type: Number,
    default: 0
  },
  todoName: {
    type: String,
    default: ''
  },
  alwaysOnTop: {
    type: Boolean,
    default: false
  }
});

const onToggleTop = () => WindowUtil.sendToParent('todo:from', {
  event: '/todo/operator/toggleTop',
  data: {
    id: props.todoId,
  }
});
const onClose = () => WindowUtil.sendToParent('todo:from', {
  event: '/todo/operator/close',
  data: {
    id: props.todoId,
  }
});
const onMinimize = () => WindowUtil.sendToParent('todo:from', {
  event: '/todo/operator/minimize',
  data: {
    id: props.todoId,
  }
});
</script>
<style scoped lang="less">
.app-frame {
  height: 32px;
  width: calc(100% - 12px);
  background-color: var(--td-bg-color-component);
  -webkit-app-region: drag; /* 不允许拖动 */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  padding: 0 6px;

  .right {
    display: flex;
    -webkit-app-region: no-drag; /* 不允许拖动 */
  }
}
</style>

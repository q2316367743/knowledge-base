<template>
  <div class="encrypt-text-tool" :style="{height: content.height + 'px'}">
    <encrypt-text-password :data="content" @unlock="onUnlock" v-if="status === 1"/>
    <encrypt-text-edit v-model="content" :lock="lock" @lock="onLock" v-else-if="status === 2"/>
    <encrypt-text-display :data="content" v-else-if="status === 3"/>
    <t-empty type="fail" title="系统异常，加密文本类型错误" v-else/>
    <div v-if="!readOnly" class="encrypt-text-tool-resize-handle" @mousedown="onMouseDown"></div>
  </div>
</template>
<script lang="ts" setup>
import {buildEncryptTextData, EncryptTextData} from "@/editor/SuperEditor/tools/EncryptTextTool/types";
import {API} from "@editorjs/editorjs";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import EncryptTextPassword from "@/editor/SuperEditor/tools/EncryptTextTool/components/EncryptTextPassword.vue";
import EncryptTextEdit from "@/editor/SuperEditor/tools/EncryptTextTool/components/EncryptTextEdit.vue";
import EncryptTextDisplay from "@/editor/SuperEditor/tools/EncryptTextTool/components/EncryptTextDisplay.vue";

const content = defineModel({
  type: Object as PropType<EncryptTextData>,
  default: buildEncryptTextData
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  api: {
    type: Object as PropType<API>,
    required: true
  }
});

const lock = ref(true);

// 1: 密码,2: 编辑器,3: 展示
const status = computed<1 | 2 | 3>(() => {
  if (props.readOnly) {
    // 只读
    if (isNotEmptyString(content.value.password)) {
      return lock.value ? 1 : 3;
    } else {
      return 3;
    }
  } else {
    if (isNotEmptyString(content.value.password)) {
      return lock.value ? 1 : 2;
    }
    return 2;
  }
});

const onLock = () => lock.value = true;
const onUnlock = () => lock.value = false;


let startY = 0;
let startHeight = 0;

const onMouseDown = (e: MouseEvent) => {
  startY = e.clientY;
  startHeight = content.value.height;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  e.preventDefault();
};

const onMouseMove = (e: MouseEvent) => {
  const newHeight = startHeight + e.clientY - startY;
  // 限制高度在200px到800px之间
  content.value.height = Math.max(200, Math.min(800, newHeight));
};

const onMouseUp = () => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};
</script>
<style scoped lang="less">
.encrypt-text-tool {
  width: 100%;
  min-height: 300px;
  padding: 8px 0;

  position: relative;
  background-color: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-default);

  .encrypt-text-tool-resize-handle {
    width: 100%;
    height: 6px;
    cursor: ns-resize;
    position: absolute;
    bottom: -3px;
    left: 0;
    background: transparent;
    transition: background-color 0.1s ease-in-out;
    text-align: center;
    line-height: 5px;
    z-index: 98;

    &:hover {
      background-color: var(--td-border-level-1-color) !important;
    }
  }
}
</style>

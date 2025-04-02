<template>
  <div class="encrypt-editor-display w-full h-full">
    <div class="encrypt-editor-display-header flex justify-between items-center">
      <div class="encrypt-editor-display-header-title flex">
        <div class="encrypt-editor-display-header-title-text">加密文本</div>
        <div class="encrypt-editor-display-header-title-tip" v-if="notPassword">
          <lock-off-icon style="color: var(--td-text-color-disabled)"/>
          <span class="ml-1">未设置密码，将明文显示</span>
        </div>
      </div>
      <div class="encrypt-editor-display-header-password">
        <t-space size="small">
          <t-button theme="primary" variant="text" size="small" @click="onAction">
            <template #icon>
              <lock-on-icon/>
            </template>
            {{ notPassword ? '设置密码' : '锁住' }}
          </t-button>
          <t-button theme="success" variant="text" size="small" @click="onSave">
            <template #icon>
              <save-icon />
            </template>
            保存
          </t-button>
        </t-space>
      </div>
    </div>
    <div class="encrypt-editor-display-content">
      <textarea @keydown="onKeyDown" v-model="content"/>
    </div>
    <encrypt-text-set v-if="setPsd" @submit="onSubmit" @cancel="onCancel"/>
  </div>
</template>
<script lang="ts" setup>
import {LockOffIcon, LockOnIcon, SaveIcon} from "tdesign-icons-vue-next";
import EncryptTextSet from "@/editor/SuperEditor/tools/EncryptTextTool/components/EncryptTextSet.vue";

const content = defineModel({
  type: String,
  default: ''
});
const props = defineProps({
  notPassword: {
    type: Boolean,
    default: false
  },
});
const emit = defineEmits(['lock', 'save', 'setPassword']);

const setPsd = ref(false);


function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.stopPropagation();
  }
}

function onAction() {
  if (props.notPassword) {
    // 设置密码
    setPsd.value = true;
  } else {
    onLock();
  }
}

const onLock = () => emit('lock');

const onSubmit = (psd: string) => {
  setPsd.value = false;
  emit('setPassword', psd);
}
const onCancel = () => setPsd.value = false;

const onSave = () => emit('save');
</script>
<style scoped lang="less">
.encrypt-editor-display {
  position: relative;

  .encrypt-editor-display-header {
    padding: 4px 8px 4px 16px;
    height: 32px;

    .encrypt-editor-display-header-title-tip {
      margin-left: 12px;
      color: var(--td-text-color-placeholder);
      user-select: none;
    }
  }

  .encrypt-editor-display-content {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;

    textarea {
      width: calc(100% - 32px);
      height: 100%;
      border: 0;
      outline: none;
      resize: none;
      padding: 0 16px;
      line-height: 1.5;
      background: transparent;
      overflow: auto;
      touch-action: manipulation;
      margin: 0;
    }

  }
}
</style>
<script lang="ts">
export default defineComponent({
  name: 'EncryptEditorEdit',
})
</script>

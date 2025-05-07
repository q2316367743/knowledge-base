<template>
  <div class="encrypt-editor-display w-full h-full">
    <div class="encrypt-editor-display-header flex justify-between items-center">
      <div class="encrypt-editor-display-header-title flex">
        <div class="encrypt-editor-display-header-title-text">数据无价，注意保存</div>
        <div class="encrypt-editor-display-header-title-tip" v-if="notPassword">
          <t-tag theme="danger" size="small">
            <template #icon>
              <lock-off-icon/>
            </template>
            未设置密码，将明文显示
          </t-tag>
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
              <save-icon/>
            </template>
            保存
          </t-button>
        </t-space>
      </div>
    </div>
    <div class="encrypt-editor-display-content" v-show="!setPsd">
      <markdown-editor v-if="type === 'markdown'" v-model="text" :preview="false"/>
      <rich-text-editor v-else-if="type === 'rich-text'" v-model="text" :read-only="false"/>
      <MonacoEditorCore v-else v-model="text" language="markdown" :read-only="false" :mini-map="false"/>
    </div>
    <encrypt-text-set v-if="setPsd" @submit="onSubmit" @cancel="onCancel"/>
  </div>
</template>
<script lang="ts" setup>
import {LockOffIcon, LockOnIcon, SaveIcon} from "tdesign-icons-vue-next";
import EncryptTextSet from "@/editor/SuperEditor/block/EncryptTextTool/components/EncryptTextSet.vue";
import MonacoEditorCore from "@/editor/MonacoEditor/MonacoEditorCore.vue";
import MarkdownEditor from '@/editor/MarkdownEditor/index.vue';
import RichTextEditor from '@/editor/RichTextEditor/index.vue';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  notPassword: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['lock', 'save', 'setPassword']);

const setPsd = ref(false);
const text = ref(props.content);

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

const onSave = () => emit('save', text.value);
</script>
<style scoped lang="less">
.encrypt-editor-display {
  position: relative;

  .encrypt-editor-display-header {
    padding: var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m) var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l);
    height: 32px;
    border-bottom: 1px solid var(--td-border-level-2-color);
    align-items: center;

    .encrypt-editor-display-header-title-text {
      font-size: var(--td-font-size-title-medium);

    }

    .encrypt-editor-display-header-title-tip {
      margin-left: var(--td-comp-margin-l);
      color: var(--td-text-color-placeholder);
      user-select: none;
    }
  }

  .encrypt-editor-display-content {
    position: absolute;
    top: calc(32px + var(--td-comp-paddingTB-m) + var(--td-comp-paddingTB-m) + 1px);
    left: 0;
    right: 0;
    bottom: 0;

  }
}
</style>
<script lang="ts">
export default defineComponent({
  name: 'EncryptEditorEdit',
})
</script>

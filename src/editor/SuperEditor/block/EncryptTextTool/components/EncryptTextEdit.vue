<template>
  <div class="encrypt-text-edit w-full h-full">
    <div class="encrypt-text-edit-header flex justify-between items-center">
      <div class="encrypt-text-edit-header-title flex">
        <div class="encrypt-text-edit-header-title-text">加密文本</div>
        <div class="encrypt-text-edit-header-title-tip" v-if="notPwd">
          <lock-off-icon style="color: var(--td-text-color-disabled)"/>
          <span class="ml-1">未设置密码，将明文显示</span>
        </div>
      </div>
      <div class="encrypt-text-edit-header-password">
        <t-button theme="primary" variant="text" size="small" @click="onAction">
          <template #icon>
            <lock-on-icon/>
          </template>
          {{ notPwd ? '设置密码' : '锁住' }}
        </t-button>
      </div>
    </div>
    <div class="encrypt-text-edit-content">
      <textarea @keydown="onKeyDown" v-model="content.text"/>
    </div>
    <encrypt-text-set v-if="setPsd" @submit="onSubmit" @cancel="onCancel"/>
  </div>
</template>
<script lang="ts" setup>
import {LockOffIcon, LockOnIcon} from "tdesign-icons-vue-next";
import {buildEncryptTextData, EncryptTextData} from "@/editor/SuperEditor/block/EncryptTextTool/types";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import EncryptTextSet from "@/editor/SuperEditor/block/EncryptTextTool/components/EncryptTextSet.vue";

const content = defineModel({
  type: Object as PropType<EncryptTextData>,
  default: buildEncryptTextData
});
const props = defineProps({
  lock: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['lock']);

const setPsd = ref(false);

const notPwd = computed(() => isEmptyString(content.value.password));

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.stopPropagation();
  }
}

function onAction() {
  if (notPwd.value) {
    // 设置密码
    setPsd.value = true;
  } else {
    onLock();
  }
}

const onLock = () => emit('lock');

const onSubmit = (psd: string) => {
  content.value.password = psd;
  setPsd.value = false;
}
const onCancel = () => setPsd.value = false;
</script>
<style scoped lang="less">
.encrypt-text-edit {
  position: relative;

  .encrypt-text-edit-header {
    padding: 4px 8px 4px 16px;
    height: 32px;
    border-bottom: 1px solid var(--td-border-level-2-color);

    .encrypt-text-edit-header-title-tip {
      margin-left: 12px;
      color: var(--td-text-color-placeholder);
      user-select: none;
    }
  }

  .encrypt-text-edit-content {
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

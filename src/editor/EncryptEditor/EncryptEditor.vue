<template>
  <div class="encrypt-editor-tool">
    <encrypt-editor-password :data="content" @unlock="onUnlock" v-if="status === 1"/>
    <encrypt-editor-edit v-model="text" :lock="lock" :not-password="!content.password"
                         @lock="onLock" @save="onSave" @set-password="setPassword"
                         v-else-if="status === 2"/>
    <encrypt-editor-display :data="content" v-else-if="status === 3"/>
    <t-empty type="fail" title="系统异常，加密文本类型错误" v-else/>
  </div>
</template>
<script lang="ts" setup>
import {isEmptyString, isNotEmptyString} from "@/utils/lang/FieldUtil";
import {buildEncryptEditorData, EncryptEditorData} from "@/editor/EncryptEditor/EncryptEditorType";
import {buildPassword, decryptText, encryptText} from "@/editor/EncryptEditor/EncryptEditorUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import EncryptEditorPassword from "@/editor/EncryptEditor/components/EncryptEditorPassword.vue";
import EncryptEditorEdit from "@/editor/EncryptEditor/components/EncryptEditorEdit.vue";
import EncryptEditorDisplay from "@/editor/EncryptEditor/components/EncryptEditorDisplay.vue";

const content = defineModel({
  type: Object as PropType<EncryptEditorData>,
  default: () => buildEncryptEditorData()
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
});

// 是否锁定
const lock = ref(true);
const text = ref('');
const password = ref('');

// 1: 密码,2: 编辑器,3: 展示
const status = computed<1 | 2 | 3>(() => {
  if (props.readOnly) {
    // 只读
    if (isNotEmptyString(content.value.password)) {
      // 未设置密码
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

const onLock = () => {
  lock.value = true;
  text.value = '';
  password.value = '';
}
const onUnlock = (pwd: string) => {
  lock.value = false;
  password.value = pwd;
  text.value = decryptText(content.value.text, password.value);
}

const setPassword = (pwd: string) => {
  password.value = pwd;
  // 设置密码
  content.value.password = buildPassword(pwd);
}

function onSave() {
  content.value.text = encryptText(text.value, password.value);
  MessageUtil.success("保存成功")
}

watch(() => props.readOnly, onLock);

onMounted(() => {
  if (isEmptyString(content.value.password)) {
    text.value = content.value.text;
  }
})
</script>
<script lang="ts">
export default defineComponent({
  name: 'EncryptEditor',
})
</script>
<style scoped lang="less">
.encrypt-editor-tool {
  width: 100%;
  height: 100%;
  padding: 8px 0;
}
</style>

<template>
  <div class="encrypt-editor-tool">
    <encrypt-editor-password :data="content.password" @unlock="onUnlock" v-if="status === 1"/>
    <encrypt-editor-edit v-model="text" :lock="lock" :not-password="!content.password"
                         @lock="onLock" @save="onSave" @set-password="setPassword"
                         v-else-if="status === 2"/>
    <encrypt-editor-display :data="text" v-else-if="status === 3"/>
    <t-empty type="fail" title="系统异常，加密文本类型错误" v-else/>
  </div>
</template>
<script lang="ts" setup>
import {isEmptyString, isNotEmptyString} from "@/utils/lang/FieldUtil";
import {buildEncryptEditorData, EncryptEditorData} from "@/editor/EncryptEditor/EncryptEditorType";
import {buildPassword, decryptText, encryptText, passwordEqual} from "@/editor/EncryptEditor/EncryptEditorUtil";
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
const password = ref<EncryptKeyIv | null>(null);

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
  password.value = null;
}
const onUnlock = (pwd: EncryptKeyIv) => {
  lock.value = false;
  password.value = pwd;
  text.value = decryptText(content.value.text, password.value);
}

const setPassword = (pwd: string) => {
  // 设置密码
  content.value.password = buildPassword(pwd);
  const keyIv = passwordEqual(pwd, content.value.password);
  if (keyIv && typeof keyIv !== 'boolean') {
    // 保存加密文本
    content.value.text = encryptText(text.value, keyIv);
    onUnlock(keyIv);
  }
}

function onSave() {
  if (!password.value) {
    onLock();
    return;
  }
  if (isEmptyString(content.value.password)) {
    content.value.text = text.value;
  } else {
    content.value.text = encryptText(text.value, password.value);
  }
  MessageUtil.success("保存成功")
}

// watch(() => props.readOnly, onLock);

onMounted(() => {
  if (isEmptyString(content.value.password)) {
    text.value = content.value.text;
    password.value = {key: '', iv: ''};
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
}
</style>

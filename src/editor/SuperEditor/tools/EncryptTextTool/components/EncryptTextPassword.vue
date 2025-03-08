<template>
  <div class="encrypt-text-password w-full h-full">
    <t-input-group>
      <t-input v-model="text"/>
      <t-button theme="primary" variant="outline">
        <template #icon>
          <lock-off-icon/>
        </template>
      </t-button>
    </t-input-group>
    输入密码
  </div>
</template>
<script lang="ts" setup>
import {EncryptTextData} from "@/editor/SuperEditor/tools/EncryptTextTool/types";
import {LockOffIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  data: {
    type: Object as PropType<EncryptTextData>
  }
});
const emit = defineEmits(['unlock']);

const text = ref('');

function onSubmit() {
  if (text.value === props.data?.password) {
    emit('unlock');
  } else {
    // 提示
  }
}
</script>
<style scoped lang="less">

</style>

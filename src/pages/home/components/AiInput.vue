<template>
  <div class="ai-input flex">
    <a-textarea
      :auto-size="{minRows: 1, maxRows: 5}"
      class="ai-input-textarea"
      v-model="question"
      :placeholder
      :disabled="loading"
      @keydown.enter="send()"
    />
    <div class="flex flex-items-end" style="flex-direction: row" :class="{'w-72px': loading}">
      <t-button class="ai-input-send" theme="primary" :variant="disabled ? 'text' : 'base'" shape="circle" :disabled
                @click="ask">
        <template #icon>
          <send-icon/>
        </template>
      </t-button>
      <t-button variant="outline" style="margin-left: 8px;" theme="danger" shape="circle" v-if="loading" @click="onStop">
        <template #icon>
          <icon-stop/>
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {useChatStore} from "@/store/components/ChatStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {SendIcon} from "tdesign-icons-vue-next";

defineProps({
  placeholder: {
    type: String,
    default: "提出你的问题，回车提问"
  }
});

const shift = useKeyModifier('Shift')

const question = ref("");

const loading = computed(() => {
  const {steamLoading, loading} = useChatStore();
  return steamLoading || loading;
});
const disabled = computed(() => isEmptyString(question.value) || loading.value);

function send() {
  if (shift.value) {
    // 只有按住shift的回车才有效
    return;
  }
  // 提问
  ask();
}

function ask() {
  if (isEmptyString(question.value)) {
    return;
  }
  useChatStore()
    .ask(question.value)
    .then(() => {
      question.value = "";
    })
    .catch((e) => {
      MessageUtil.error("提问失败", e);
    });
}

const onStop = () => useChatStore().stop();
</script>
<style scoped lang="less">
.ai-input {
  border: 1px solid var(--color-border-2);
  border-radius: var(--border-radius-medium);
  padding: 8px;
  transition: border-color 0.3s;
  background-color: var(--color-bg-1);
  min-width: 616px;

  &:hover {
    border: 1px solid var(--color-border-3);
  }

  :deep(.arco-textarea-wrapper) {
    background-color: transparent;
    border: none !important;
  }

}
</style>

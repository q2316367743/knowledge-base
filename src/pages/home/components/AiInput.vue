<template>
  <div class="ai-input flex">
    <t-textarea
      class="ai-input-textarea"
      :autosize="{minRows: 1, maxRows: 4}"
      v-model="question"
      :placeholder="placeholder"
      :disabled="loading"
      @keydown="send"
      ref="textareaRef"
    />
    <div class="flex flex-items-end" style="flex-direction: row" :class="{'w-72px': loading}">
      <t-button class="ai-input-send" theme="primary" :variant="disabled ? 'text' : 'base'" shape="circle"
                :disabled="disabled" @click="ask">
        <template #icon>
          <send-icon/>
        </template>
      </t-button>
      <t-button variant="outline" style="margin-left: 8px;" theme="danger" shape="circle" v-if="loading"
                @click="onStop">
        <template #icon>
          <stop-icon/>
        </template>
      </t-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {SendIcon, StopIcon} from "tdesign-icons-vue-next";
import {TextareaValue} from "tdesign-vue-next";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {useChatStore} from "@/store/components/ChatStore";
import MessageUtil from "@/utils/modal/MessageUtil";

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

function send(_value: TextareaValue, context: { e: KeyboardEvent; }) {
  const {e} = context;
  if (e.code === 'Enter') {
    if (shift.value) {
      // 只有按住shift的回车才有效
      e.preventDefault();
      return;
    }
    // 提问
    ask();
  }
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
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--td-radius-default);
  padding: 8px;
  transition: border-color 0.3s;
  background-color: var(--td-bg-color-container);
  min-width: 616px;

  &:hover {
    border: 1px solid var(--td-border-level-1-color);
  }

  :deep(.t-textarea__inner) {
    border: none !important;
  }

  :deep(.t-is-focused) {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>

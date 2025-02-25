<template>
  <div class="ai-input flex">
    <a-textarea
      :auto-size="{minRows: 1, maxRows: 5}"
      class="ai-input-textarea"
      v-model="question"
      placeholder="提出你的问题，回车提问"
      :disabled="loading"
      @keydown.enter="send()"
    />
    <div class="flex flex-items-end" style="flex-direction: row" :class="{'w-72px': loading}">
      <a-button class="ai-input-send" :type="disabled ? 'text' : 'primary'" shape="circle" :disabled @click="ask">
        <template #icon>
          <icon-send/>
        </template>
      </a-button>
      <a-button type="outline" class="ml-8px" status="danger" v-if="loading" @click="onStop">
        <template #icon>
          <icon-stop/>
        </template>
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {useChatStore} from "@/store/components/ChatStore";
import MessageUtil from "@/utils/modal/MessageUtil";


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

<template>
  <div class="form-container">
    <feedback-md-editor v-model="content" />
    <t-button class="form-submit" @click="handleSubmit">回复</t-button>
  </div>
</template>
<script lang="ts" setup>
import {isEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {FeedbackView} from "@/nested/feedback/apis/feedback/info";
import {feedbackReply} from "@/nested/feedback/apis/feedback/reply";
import FeedbackMdEditor from "@/nested/feedback/components/FeedbackMdEditor.vue";

const props = defineProps({
  item: {
    type: Object as PropType<FeedbackView>,
  },
  nickname: {
    type: String,
    default: '匿名用户'
  },
  replyId: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['refresh']);

const loading = ref(false);
const content = ref('');

function handleSubmit() {
  if (isEmptyString(content.value)) return MessageUtil.error("回复内容不能为空");
  loading.value = true;
  feedbackReply(
    props.item?.id || '',
    {
      content: content.value,
      replyId: props.replyId,
    }
  ).then(() => {
    MessageUtil.success("回复成功");
    content.value = '';
    emit("refresh");
  }).finally(() => loading.value = false)
}

</script>
<style scoped lang="less">
.form-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;

  .form-submit {
    margin-top: 8px;
  }
}
</style>

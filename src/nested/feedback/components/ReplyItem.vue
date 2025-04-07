<template>
  <t-comment
    :avatar="avatar"
    :datetime="prettyDate(item.createTime)"
  >
    <template #content>
      <chat-content   :value="item.content"/>
    </template>
    <template #author>
      <user-view :user="item.create"/>
      <caret-right-small-icon size="medium" style="margin: 0 4px" v-if="props.reply?.replyTo"/>
      <user-view v-if="props.reply?.replyTo" :user="props.reply?.replyTo"/>
    </template>
    <template #actions>
      <div v-if="feedback?.isClose">反馈已关闭</div>
      <t-space v-else key="chat" :size="6" @click="switchReply">
        <chat-icon />
        <span>回复</span>
      </t-space>
    </template>
    <template #reply v-if="replyVisible">
      <feedback-reply v-if="replyVisible && !feedback?.isClose" :item="feedback" :nickname="nickname"
                      :reply-id="reply?.id"
                      @refresh="handleRefresh"/>
    </template>
  </t-comment>
</template>
<script lang="ts" setup>
import {FeedbackView, ReplyView} from "@/nested/feedback/apis/feedback/info";
import MessageUtil from "@/utils/modal/MessageUtil";
import {prettyDate} from "@/utils/lang/FormatUtil";
import UserView from "@/nested/feedback/components/UserView.vue";
import {CaretRightSmallIcon, ChatIcon} from "tdesign-icons-vue-next";
import FeedbackReply from "@/nested/feedback/components/FeedbackReply.vue";

const props = defineProps({
  reply: {
    type: Object as PropType<ReplyView>,
  },
  feedback: {
    type: Object as PropType<FeedbackView>,
  }
});
const emit = defineEmits(['refresh']);

const replyVisible = ref(false);
const item = ref<ReplyView>({});

const avatar = computed(() => props.reply?.create?.avatar || '/user.png');
const nickname = computed(() => props.reply?.create?.nickname || '匿名用户');

onMounted(() => item.value = props.reply || {})

function switchReply() {
  if (props.feedback?.isClose) {
    MessageUtil.error("反馈已关闭，无法评论")
    return;
  }
  replyVisible.value = !replyVisible.value;
}

function handleRefresh() {
  replyVisible.value = false
  emit("refresh");
}

</script>
<style scoped lang="less">
.reply-like {
  fill: var(--td-text-color-link);
  color: var(--td-text-color-link);
}
</style>

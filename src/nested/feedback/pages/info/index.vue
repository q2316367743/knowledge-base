<template>
  <sub-page-layout title="反馈详情">
    <div class="p-8px">
      <t-comment
        v-if="item"
        :datetime="prettyDate(item.createTime)"
      >
        <template #author>
          <user-view :user="item.create"/>
        </template>
        <template #content>
          <chat-content :value="item.content"/>
        </template>
        <template #actions>
          <div v-if="item.isClose">反馈已关闭</div>
          <t-space v-else key="chat" :size="6" @click="switchReply()">
            <chat-icon/>
            <span>回复</span>
          </t-space>
        </template>
        <template v-if="(item.replies && item.replies.length > 0) || replyVisible" #reply>
          <reply-item v-for="reply in item.replies" :key="reply.id" :reply="reply" :feedback="item"
                      @refresh="handleRefresh"/>
          <feedback-reply v-if="replyVisible && !item.isClose" :item="item" :nickname="nickname"
                          @refresh="handleRefresh"
                          style="margin-top: 32px"/>
        </template>
        <!-- 此处新增回复 -->
      </t-comment>
    </div>
  </sub-page-layout>
</template>
<script lang="ts" setup>
import {feedbackInfo, FeedbackView} from "@/nested/feedback/apis/feedback/info";
import {prettyDate} from "@/utils/lang/FormatUtil";
import {ChatIcon} from "tdesign-icons-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import UserView from "@/nested/feedback/components/UserView.vue";
import ReplyItem from "@/nested/feedback/components/ReplyItem.vue";
import FeedbackReply from "@/nested/feedback/components/FeedbackReply.vue";

const route = useRoute();

const replyVisible = ref(false);
const item = ref<FeedbackView>({});

const nickname = computed(() => item.value.create?.nickname || '匿名用户');

onMounted(() => {
  feedbackInfo(route.params.id as string)
    .then(e => {
      item.value = e;
    });
});

function switchReply() {
  if (item.value.isClose) {
    MessageUtil.error("反馈已关闭，无法评论")
    return;
  }
  // 判断是否登录
  replyVisible.value = !replyVisible.value;
}

function handleRefresh() {
  replyVisible.value = false;
  feedbackInfo(
    route.params.id as string || '',
  ).then(res => {
    item.value = res;
  })
}
</script>
<style scoped lang="less">

</style>

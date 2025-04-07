<template>
  <t-layout class="h-100vh p-8px">
    <t-content>
      <t-loading :loading="loading">
        <div v-if="list.length > 0">
          <t-list :split="true">
            <t-list-item v-for="item in list">
              <div class="flex flex-col w-full">
                <div class="ellipsis-3">
                  <chat-content :content="item.content" style="padding: 0"/>
                </div>
                <div class="flex justify-between">
                  <t-tag :theme="!!item.replyCount ?  'success':'primary'">
                    {{ !!item.replyCount ? '已回复' : '未回复' }}
                  </t-tag>
                  <t-button size="small" theme="primary" @click="toInfo(item.id)">详情</t-button>
                </div>
              </div>
            </t-list-item>
          </t-list>
          <div class="mt-8px" style="padding: 0 12px">
            <t-pagination :total="total" :page-size="pageSize" :current="pageNum" @change="fetchData" size="small"/>
          </div>
        </div>
        <empty-result v-else title="您还没有反馈记录"/>
      </t-loading>
    </t-content>
    <t-footer style="padding: 8px 16px">
      <t-button theme="primary" :block="true" @click="toPost">提反馈</t-button>
    </t-footer>
  </t-layout>
</template>
<script lang="ts" setup>
import {FeedbackListView, userFeedback} from "@/nested/feedback/apis/user/feedback";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useFeedbackStore} from "@/nested/feedback/store";
import {ChatContent} from '@tdesign-vue-next/chat';

const router = useRouter();

const pageNum = ref(1);
const pageSize = ref(1);
const list = ref<Array<FeedbackListView>>([]);
const total = ref(0);
const loading = ref(false);


function fetchData() {
  loading.value = true;
  userFeedback({pageNum: pageNum.value, pageSize: pageSize.value})
    .then(e => {
      list.value = e.data || [];
      total.value = e.total || 0;
    })
    .finally(() => loading.value = false);
}

onMounted(async () => {
  // 先判断是否uTools登录
  if (!utools.getUser()) {
    MessageUtil.error("请先登录uTools账号，登录后才可以进行反馈。");
    return;
  }
  await useFeedbackStore().init();
  switch (useFeedbackStore().status) {
    case 2:
      MessageUtil.error("登录失败");
      return;
    case 3:
      MessageUtil.error("uTooLs未登录");
      return;
  }
  // 获取反馈信息，但是是异步的
  fetchData()
});

function toPost() {
  router.push('/post')
}

function toInfo(id: string) {
  router.push(`/info/${id}`)
}
</script>
<style scoped lang="less">

</style>

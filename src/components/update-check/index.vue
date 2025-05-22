<template>
  <t-dialog v-model:visible="visible" header="版本更新" placement="center" width="600px"
            confirm-btn="查看更详细更新内容" @confirm="toUpdateLog()">
    <t-alert style="margin-bottom: 7px">
      <span>更加详细的更新说明，可以关注</span>
      <t-link @click="toBlog()">作者博客</t-link>
      <span>，反馈请前往</span>
      <t-link @click="toFeedback()">兔小巢</t-link>
      <span>。</span>
    </t-alert>
    <div class="entry">
      <div>
        <span>恭喜你成功更新到 </span>
        <span style="color: var(--td-brand-color-10)">{{ version }}</span>
      </div>
      <div>本次更新如下：</div>
      <update-item :log="log"/>
    </div>
  </t-dialog>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog.json";
import Constant, {toFeedback} from "@/global/Constant";
import updateCheck from "@/components/update-check/UpdateCheck";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {Log} from "@/components/update-check/domain";

const router = useRouter();

const log = UpdateLog[0] as Log;
const version = Constant.version;
const visible = ref(false);

// 初始化数据
import('@/global/BeanFactory').then(data => {
  useGlobalStore().startLoading("开始初始化数据...");
  // 检查更新、执行更新
  updateCheck(() => visible.value = true)
    .catch(e => MessageUtil.error("更新失败", e))
    .finally(() =>
      data.initData().catch(e => MessageUtil.error("数据初始化失败", e))
        .finally(() => useGlobalStore().closeLoading()))
});

const toBlog = () => InjectionUtil.shellOpenExternal(Constant.website)
const toUpdateLog = () => router.push('/more/update');

</script>
<style scoped>

</style>

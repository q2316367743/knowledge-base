<template>
  <t-dialog v-model:visible="visible" placement="center" width="600px" confirm-btn="立即查看更新记录"
            @confirm="toUpdateLog">
    <template #header>
      <span>恭喜你成功更新到 </span>
      <span style="color: var(--td-brand-color-10)">{{ version }}</span>
    </template>
    <success-result />
  </t-dialog>
</template>
<script lang="ts" setup>
import Constant from "@/global/Constant";
import updateCheck from "@/components/update-check/UpdateCheck";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useLoading} from "@/hooks";

const router = useRouter();

const version = Constant.version;
const visible = ref(false);

// 初始化数据
import('@/global/BeanFactory').then(data => {
  const close = useLoading("开始初始化数据...");
  // 检查更新、执行更新
  updateCheck(() => visible.value = true)
    .catch(e => MessageUtil.error("更新失败", e))
    .finally(() =>
      data.initData().catch(e => MessageUtil.error("数据初始化失败", e))
        .finally(() => close()))
});

const toBlog = () => InjectionUtil.shellOpenExternal(Constant.website)
const toUpdateLog = () => router.push('/more/update');

</script>
<style scoped>

</style>

<template>
    <a-modal v-model:visible="visible" title="版本更新" mask-closable draggable lock-scroll
             width="600px" ok-text="查看更详细更新内容" @ok="toUpdateLog()">
        <a-alert style="margin-bottom: 7px">
            更加详细的更新说明，可以关注
            <a-link @click="toBlog()">作者博客</a-link>
        </a-alert>
        <div class="entry">
            <div>
                <span>恭喜你成功更新到 </span>
                <span style="color: rgb(var(--arcoblue-6))">{{ version }}</span>
            </div>
            <div>本次更新如下：</div>
            <update-item :log="log"/>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog";
import {ref} from "vue";
import Constant from "@/global/Constant";
import updateCheck from "@/components/update-check/UpdateCheck";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const log = UpdateLog[0];
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

const toBlog = () => utools.shellOpenExternal(Constant.website)
const toUpdateLog = () => router.push('/more/update');

</script>
<style scoped>

</style>
